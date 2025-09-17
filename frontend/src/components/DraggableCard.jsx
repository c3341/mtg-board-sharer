import React from 'react';
import { useDrag } from 'react-dnd';
import { useCardContext } from '../contexts/CardContext';

function DraggableCard({ card }) {
  const { toggleTap } = useCardContext();

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

  // カウンター機能は今回は実装しないので、onContextMenuは不要
  // const handleContextMenu = (e) => {
  //   e.preventDefault();
  //   if (onContextMenu) {
  //     onContextMenu(card.instanceId, e);
  //   }
  // };

  return (
    // drag refをDOM要素にアタッチすることで、その要素がドラッグ可能になる
    <div
      ref={drag}
      className={`card-item ${card.isTapped ? 'tapped' : ''}`} // タップ状態に応じてクラスを追加
      style={{ opacity: isDragging ? 0.5 : 1 }} // ドラッグ中は半透明にする
      onClick={handleClick} // クリックイベントを追加
      // onContextMenu={handleContextMenu} // 右クリックイベントは今回は追加しない
    >
      <p>{card.printed_name || card.name}</p>
      {card.image_uris && card.image_uris.small && (
        <img src={card.image_uris.small} alt={card.name} />
      )}
      {/* カウンター表示は今回は追加しない */}
      {/* {card.counters > 0 && (
        <div className="card-counters">{card.counters}</div>
      )} */}
    </div>
  );
}

export default DraggableCard;