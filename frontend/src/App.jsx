import CardSearch from './components/CardSearch';
import Battlefield from './components/Battlefield';
import Hand from './components/Hand';
import PlayerLifeDisplay from './components/PlayerLifeDisplay';
import { useCardContext } from './contexts/CardContext';

function App() {
  const { addCard } = useCardContext();

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
          {/* Future: Player's Graveyard/Library */}
        </div>
      </main>

      <div className="hand-area player-hand-area">
        <Hand zoneType="myHand" />
      </div>
    </div>
  )
}

export default App