import React from 'react';
import { useDrag } from 'react-dnd';

function DraggableCard({ card }) {
  // useDragフックを使って、このコンポーネントをドラッグ可能にする
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card', // ドラッグするアイテムのタイプを定義
    item: { instanceId: card.instanceId, zone: card.zone }, // ドラッグ中に渡すデータ
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // ドラッグ中かどうかを監視
    }),
  }));

  return (
    // drag refをDOM要素にアタッチすることで、その要素がドラッグ可能になる
    <div
      ref={drag}
      className="card-item"
      style={{ opacity: isDragging ? 0.5 : 1 }} // ドラッグ中は半透明にする
    >
      <p>{card.printed_name || card.name}</p>
      {card.image_uris && card.image_uris.small && (
        <img src={card.image_uris.small} alt={card.name} />
      )}
    </div>
  );
}

export default DraggableCard;
