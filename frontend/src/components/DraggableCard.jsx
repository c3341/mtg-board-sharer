import React, { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { useCardContext } from '../contexts/CardContext';

// カードバック画像のパス
const CARD_BACK_IMAGE = '/card_back.jpg'; // publicフォルダ直下

function DraggableCard({ card }) {
  const { toggleTap, toggleFaceDown } = useCardContext();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { instanceId: card.instanceId, zone: card.zone },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = (e) => {
    // コンテキストメニュー表示中は、通常のクリックを無効化
    if (contextMenu.visible) {
      e.preventDefault();
      setContextMenu({ visible: false, x: 0, y: 0 });
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
    e.stopPropagation(); // 他のクリックイベントへの伝播を停止
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  // 表示する画像のURLを決定
  const imageUrl = card.isFaceDown ? CARD_BACK_IMAGE : (card.image_uris && card.image_uris.small);

  return (
    <>
      {/* drag refをDOM要素にアタッチすることで、その要素がドラッグ可能になる */}
      <div
        ref={drag}
        className={`card-item ${card.isTapped ? 'tapped' : ''}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {!card.isFaceDown && <p>{card.printed_name || card.name}</p>}
        {imageUrl && (
          <img src={imageUrl} alt={card.isFaceDown ? 'Card Back' : card.name} />
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={closeContextMenu} // メニュー自体をクリックしても閉じる
        >
          <ul>
            <li>タップ / アンタップ</li>
            <li>表向き / 裏向き</li>
            <li>カウンターを置く</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default DraggableCard;
