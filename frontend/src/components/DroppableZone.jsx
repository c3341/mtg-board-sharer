import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableCard from './DraggableCard';

// 汎用的なドロップ可能ゾーンコンポーネント
function DroppableZone({ zoneId, cards, moveCard, className = '' }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item) => moveCard(item.instanceId, zoneId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const filteredCards = cards.filter(card => card.zone === zoneId);

  return (
    <div 
      ref={drop} 
      // 呼び出し元から渡されたクラス名と、基本のクラス名を結合
      className={`droppable-zone ${className}`}
      style={{ backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent' }}
    >
      {filteredCards.map(card => (
        <DraggableCard key={card.instanceId} card={card} />
      ))}
    </div>
  );
}

export default DroppableZone;
