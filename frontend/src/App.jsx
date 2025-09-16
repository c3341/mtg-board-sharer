import CardSearch from './components/CardSearch';
import Battlefield from './components/Battlefield';
import Hand from './components/Hand';
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
    <div className="app-container"> {/* 新しいクラス名を追加 */}
      <h1>MTG Board Sharer</h1>
      <CardSearch onCardSelect={handleCardSelect} />

      <div className="board-container"> {/* 新しいクラス名を追加 */}
        {/* 相手の盤面 (上部) */}
        <div className="opponent-zone">
          <h2>相手の盤面</h2>
          <div className="zone-row">
            <Hand /> {/* 相手の手札 */}
            <Battlefield /> {/* 相手の戦場 */}
          </div>
        </div>

        {/* 自分の盤面 (下部) */}
        <div className="player-zone">
          <h2>自分の盤面</h2>
          <div className="zone-row">
            <Hand /> {/* 自分の手札 */}
            <Battlefield /> {/* 自分の戦場 */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
