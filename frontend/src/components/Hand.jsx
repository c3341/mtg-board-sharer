import React from 'react';
import { useCardContext } from '../contexts/CardContext';

function Hand() {
  const { cards } = useCardContext();

  return (
    <div className="zone-box"> {/* 新しいクラス名 */}
      <h3>手札 (Hand)</h3>
      {cards.length === 0 ? (
        <p>手札にカードはありません。</p>
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

export default Hand;