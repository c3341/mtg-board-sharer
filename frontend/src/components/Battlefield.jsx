import React from 'react';
import { useCardContext } from '../contexts/CardContext';

function Battlefield() {
  const { cards } = useCardContext();

  return (
    <div className="zone-box"> {/* 新しいクラス名 */}
      <h3>戦場 (Battlefield)</h3>
      {cards.length === 0 ? (
        <p>戦場にカードはありません。</p>
      ) : (
        <div className="zone-row"> {/* 新しいクラス名 */}
          {cards.map(card => (
            <div key={card.id} className="card-item"> {/* 新しいクラス名 */}
              <p>{card.printed_name || card.name}</p>
              {card.image_uris && card.image_uris.small && (
                <img src={card.image_uris.small} alt={card.name} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Battlefield;