import React from 'react';
import { useCardContext } from '../contexts/CardContext';
import DraggableCard from './DraggableCard';
import { useDrop } from 'react-dnd';

// 戦場内の各ゾーン（土地・非土地）を表すコンポーネント
const DroppableSubZone = ({ zoneId, cards, moveCard }) => {
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
      className="sub-zone" // 新しいCSSクラス
      style={{ backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent' }}
    >
      {filteredCards.length > 0 && (
        <div className="zone-row">
          {filteredCards.map(card => (
            <DraggableCard key={card.instanceId} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};


function Battlefield({ playerType }) {
  const { cards, moveCard } = useCardContext();

  // playerTypeに基づいて、土地と非土地ゾーンのIDを決定
  const landZoneId = playerType === 'my' ? 'myLand' : 'opponentLand';
  const nonLandZoneId = playerType === 'my' ? 'myNonLand' : 'opponentNonLand';

  return (
    <div className="battlefield-container"> {/* 戦場全体を囲む新しいコンテナ */}
      {/* 上段: 非土地クリーチャーゾーン */}
      <DroppableSubZone zoneId={nonLandZoneId} cards={cards} moveCard={moveCard} />
      {/* 下段: 土地ゾーン */}
      <DroppableSubZone zoneId={landZoneId} cards={cards} moveCard={moveCard} />
    </div>
  );
}

export default Battlefield;