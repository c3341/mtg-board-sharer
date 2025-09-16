import React from 'react';
import { useCardContext } from '../contexts/CardContext';
import DraggableCard from './DraggableCard';
import { useDrop } from 'react-dnd';

function Battlefield({ zoneType }) {
  const { cards, moveCard } = useCardContext();

  const filteredCards = cards.filter(card => card.zone === zoneType);

  const zoneDisplayName = {
    myBattlefield: '自分の戦場',
    opponentBattlefield: '相手の戦場',
  }[zoneType] || '戦場';

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item, monitor) => {
      moveCard(item.id, zoneType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    // ルートのdivに直接drop refとスタイルを適用
    <div
      ref={drop}
      className="battlefield-area" // index.cssで定義されたクラス
      style={{ backgroundColor: isOver ? 'lightgreen' : 'transparent' }} // ホバー時に色を変える
    >
      <h3>{zoneDisplayName}</h3>
      {filteredCards.length === 0 ? (
        <p>{zoneDisplayName}にカードはありません。</p>
      ) : (
        <div className="zone-row"> {/* カード表示用のコンテナ */}
          {filteredCards.map(card => (
            <DraggableCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Battlefield;
