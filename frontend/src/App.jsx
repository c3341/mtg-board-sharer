import CardSearch from './components/CardSearch';
import Battlefield from './components/Battlefield';
import Hand from './components/Hand';
import PlayerLifeDisplay from './components/PlayerLifeDisplay'; // PlayerLifeDisplayをインポート
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
      <CardSearch onCardSelect={handleCardSelect} />

      <div className="board-container">
        {/* 相手の盤面 (上部) */}
        <div className="opponent-zone">
          <h2>相手の盤面</h2>
          <PlayerLifeDisplay playerType="opponent" /> {/* 相手のライフ表示 */}
          <div className="zone-row">
            <Hand zoneType="opponentHand" />
            <Battlefield zoneType="opponentBattlefield" />
          </div>
        </div>

        {/* 自分の盤面 (下部) */}
        <div className="player-zone">
          <h2>自分の盤面</h2>
          <PlayerLifeDisplay playerType="my" /> {/* 自分のライフ表示 */}
          <div className="zone-row">
            <Hand zoneType="myHand" />
            <Battlefield zoneType="myBattlefield" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
