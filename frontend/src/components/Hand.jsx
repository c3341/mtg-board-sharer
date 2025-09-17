import React from 'react';
import { useCardContext } from '../contexts/CardContext';
import DraggableCard from './DraggableCard';
import { useDrop } from 'react-dnd';

function Hand({ zoneType }) {
  const { cards, moveCard } = useCardContext();

  const filteredCards = cards.filter(card => card.zone === zoneType);

  const zoneDisplayName = {
    myHand: '自分の手札',
    opponentHand: '相手の手札',
  }[zoneType] || '手札';

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item, monitor) => {
      moveCard(item.instanceId, zoneType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    // ルートのdivに直接drop refとスタイルを適用
    <div
      ref={drop}
      className="zone-droppable-area" // 新しい、より汎用的なクラス名
      style={{ backgroundColor: isOver ? 'rgba(0, 150, 255, 0.1)' : 'transparent', height: '100%' }} // ホバー色をテーマに合わせ、高さを100%に
    >
      {filteredCards.length > 0 && (
        <div className="zone-row"> {/* カード表示用のコンテナ */}
          {filteredCards.map(card => (
            <DraggableCard key={card.instanceId} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Hand;
