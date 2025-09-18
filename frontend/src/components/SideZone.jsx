import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableCard from './DraggableCard';
import { useCardContext } from '../contexts/CardContext';

function SideZone({ zoneId }) {
  const { cards, moveCard } = useCardContext();

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
      className="side-zone-droppable" // このエリア専用のクラス名
      style={{ 
        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
      }}
    >
      {filteredCards.map(card => (
        <DraggableCard key={card.instanceId} card={card} />
      ))}
    </div>
  );
}

export default SideZone;
