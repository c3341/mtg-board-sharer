import { useState } from 'react'; // useStateをインポート
import CardSearch from './components/CardSearch';

function App() {
  // 盤面に追加されたカードのリストを管理するstate
  const [selectedCards, setSelectedCards] = useState([]);

  // カードが選択されたときに呼ばれる関数
  const handleCardSelect = async (cardName) => { // asyncキーワードを追加
    console.log('Appコンポーネントでカードが選択されました:', cardName);

    // Scryfallのカード検索APIエンドポイント
    const SCRYFALL_CARD_SEARCH_URL = 'https://api.scryfall.com/cards/named'; // 特定のカード名で検索

    try {
      // 選択されたカード名でScryfall APIを叩き、カードの詳細情報を取得
      // encodeURIComponentでカード名をURLエンコードする
      const response = await fetch(`${SCRYFALL_CARD_SEARCH_URL}?exact=${encodeURIComponent(cardName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cardData = await response.json();
      console.log('取得したカードデータ:', cardData);

      // 取得したカードデータをselectedCardsに追加
      setSelectedCards(prevCards => [...prevCards, cardData]);

    } catch (error) {
      console.error('カード詳細情報の取得中にエラーが発生しました:', error);
    }
  };

  return (
    <div>
      <h1>MTG Board Sharer</h1>
      <CardSearch onCardSelect={handleCardSelect} />

      <h2>盤面に追加されたカード:</h2>
      {selectedCards.length === 0 ? (
        <p>まだカードがありません。</p>
      ) : (
        <ul>
          {selectedCards.map((card, index) => (
            <li key={card.id || index}>
              {card.printed_name || card.name}
              {card.image_uris && card.image_uris.small && (
                <img src={card.image_uris.small} alt={card.name} style={{ marginLeft: '10px', height: '100px' }} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App