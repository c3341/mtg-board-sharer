import React from 'react';
import { useDrag } from 'react-dnd';
import { useCardContext } from '../contexts/CardContext';

// カードバック画像のパス
const CARD_BACK_IMAGE = '/card_back.jpg'; // publicフォルダ直下

function DraggableCard({ card }) {
  const { toggleTap, toggleFaceDown } = useCardContext(); // toggleFaceDownを取得

  // useDragフックを使って、このコンポーネントをドラッグ可能にする
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card', // ドラッグするアイテムのタイプを定義
    item: { instanceId: card.instanceId, zone: card.zone }, // ドラッグ中に渡すデータ
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // ドラッグ中かどうかを監視
    }),
  }));

  const handleClick = (e) => {
    toggleTap(card.instanceId);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation(); // クリックイベントの伝播を停止
    toggleFaceDown(card.instanceId);
  };

  // 表示する画像のURLを決定
  const imageUrl = card.isFaceDown ? CARD_BACK_IMAGE : (card.image_uris && card.image_uris.small);

  return (
    // drag refをDOM要素にアタッチすることで、その要素がドラッグ可能になる
    <div
      ref={drag}
      className={`card-item ${card.isTapped ? 'tapped' : ''}`} // タップ状態に応じてクラスを追加
      style={{ opacity: isDragging ? 0.5 : 1 }} // ドラッグ中は半透明にする
      onClick={handleClick} // クリックイベントを追加
      onDoubleClick={handleDoubleClick} // ダブルクリックイベントを追加
    >
      {/* 裏向きの場合は名前を表示しない */}
      {!card.isFaceDown && <p>{card.printed_name || card.name}</p>}
      {imageUrl && (
        <img src={imageUrl} alt={card.isFaceDown ? 'Card Back' : card.name} />
      )}
    </div>
  );
}

export default DraggableCard;
