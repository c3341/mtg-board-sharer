import { useState, useEffect } from 'react';
import CardSearch from './components/CardSearch';

function App() {
  const [cardNameList, setCardNameList] = useState([]);

  useEffect(() => {
    const CACHE_KEY = 'mtgCardNameList';

    // 1. まずローカルストレージからキャッシュを探す
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (cachedData) {
      // 2. キャッシュがあれば、それを使う (高速)
      console.log('キャッシュからカード名リストを読み込みました。');
      setCardNameList(JSON.parse(cachedData));
    } else {
      // 3. キャッシュがなければ、APIから取得する (低速)
      console.log('キャッシュがないため、APIからカード名リストを取得します。');
      // TODO: ここでScryfall APIからカード名リストを取得する処理を後で追加します

      const dummyData = [
        'Black Lotus', 'Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Time Walk', 'Ancestral Recall',
      ];
      
      // 取得したデータをstateにセット
      setCardNameList(dummyData);
      // 同時に、将来のためにローカルストレージに保存する
      localStorage.setItem(CACHE_KEY, JSON.stringify(dummyData));
      console.log('APIから取得したリストをキャッシュに保存しました。');
    }
  }, []); // このeffectは初回レンダリング時に一度だけ実行されます

  return (
    <div>
      <h1>MTG Board Sharer</h1>
      {/* CardSearchコンポーネントにcardNameListをpropsとして渡す */}
      <CardSearch cardNameList={cardNameList} />
    </div>
  )
}

export default App
