import React, { useState, useCallback, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { useCardContext } from '../contexts/CardContext';

// カードバック画像のパス
const CARD_BACK_IMAGE = '/card_back.jpg'; // publicフォルダ直下

function DraggableCard({ card }) {
  const { 
    toggleTap, 
    toggleFaceDown, 
    deleteCard, 
    duplicateCard, 
    addCounters
  } = useCardContext();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { instanceId: card.instanceId, zone: card.zone },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = (e) => {
    // 左クリックでメニューが表示されていれば閉じる
    if (contextMenu.visible) {
      e.preventDefault();
      closeContextMenu();
      return;
    }
    toggleTap(card.instanceId);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    toggleFaceDown(card.instanceId);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeContextMenu = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  // メニューの外側をクリックしたときに閉じるためのエフェクト
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };
    // メニュー表示時にのみイベントリスナーを追加
    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
    }
    // クリーンアップ関数
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible, closeContextMenu]);


  // 表示する画像のURLを決定
  const getProxiedUrl = (scryfallUrl) => {
    // Viteのプロキシ設定により、このリクエストはバックエンドに転送される
    return `/api/image-proxy?url=${encodeURIComponent(scryfallUrl)}`;
  }
  const imageUrl = card.isFaceDown 
    ? CARD_BACK_IMAGE 
    : (card.image_uris && card.image_uris.small ? getProxiedUrl(card.image_uris.small) : null);

  return (
    <>
      <div
        ref={drag}
        className={`card-item ${card.isTapped ? 'tapped' : ''}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {/* カウンター表示 */}
        {card.counters && card.counters.length > 0 && (
          <div className="counter-badge">
            {card.counters.length}
          </div>
        )}

        {!card.isFaceDown && <p>{card.printed_name || card.name}</p>}
        {imageUrl && (
          <img src={imageUrl} alt={card.isFaceDown ? 'Card Back' : card.name} />
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul>
            <li onClick={() => { addCounters(card.instanceId, 1); closeContextMenu(); }}>カウンターを1個置く</li>
            <li onClick={() => {
              const amountStr = prompt('置くカウンターの数を入力してください:', '1');
              if (amountStr) { // キャンセルでなければ
                const amount = parseInt(amountStr, 10);
                if (!isNaN(amount) && amount > 0) {
                  addCounters(card.instanceId, amount);
                }
              }
              closeContextMenu();
            }}>カウンターを置く...</li>
            <li onClick={() => { duplicateCard(card.instanceId); closeContextMenu(); }}>複製する</li>
            <li onClick={() => { deleteCard(card.instanceId); closeContextMenu(); }}>消去する</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default DraggableCard;
