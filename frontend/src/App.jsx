import React from 'react';
import CardSearch from './components/CardSearch';
import Battlefield from './components/Battlefield';
import Hand from './components/Hand';
import PlayerLifeDisplay from './components/PlayerLifeDisplay';
import { useCardContext } from './contexts/CardContext';
import { useDrop } from 'react-dnd';
import DraggableCard from './components/DraggableCard';

// Battlefield.jsxからコピーしてきた、動作実績のあるコンポーネント
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
      className="sub-zone" // 意図的に.sub-zoneクラスを使用
      style={{ backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent', height: '100%' }}
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

function App() {
  const { addCard, cards, moveCard } = useCardContext();

  const handleCardSelect = async (cardName) => {
    console.log('Appコンポーネントでカードが選択されました:', cardName);

    const SCRYFALL_CARD_SEARCH_URL = 'https://api.scryfall.com/cards/named';

    try {
      const response = await fetch(`${SCRYFALL_CARD_SEARCH_URL}?exact=${encodeURIComponent(cardName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cardData = await response.json();
      console.log('取得したカードデータ:', cardData);

      addCard(cardData);

    } catch (error) {
      console.error('カード詳細情報の取得中にエラーが発生しました:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>MTG Board Sharer</h1>
      <div className="search-container">
        <CardSearch onCardSelect={handleCardSelect} />
      </div>

      <div className="opponent-hand-area">
        <Hand zoneType="opponentHand" />
      </div>

      <main className="game-board">
        <div className="player-info opponent-info">
          <PlayerLifeDisplay playerType="opponent" />
        </div>
        <div className="battlefield-area opponent-battlefield">
          <Battlefield playerType="opponent" />
        </div>
        <div className="side-info opponent-side">
          {/* Future: Opponent's Graveyard/Library */}
        </div>

        <div className="player-info my-info">
          <PlayerLifeDisplay playerType="my" />
        </div>
        <div className="battlefield-area my-battlefield">
          <Battlefield playerType="my" />
        </div>
        <div className="side-info my-side">
          {/* <SideZone zoneId="mySide" /> */}
          <DroppableSubZone zoneId="mySide" cards={cards} moveCard={moveCard} />
        </div>
      </main>

      <div className="hand-area player-hand-area">
        <Hand zoneType="myHand" />
      </div>
    </div>
  )
}

export default App;
