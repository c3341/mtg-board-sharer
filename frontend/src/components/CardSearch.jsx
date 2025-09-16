import { useState, useEffect } from 'react';

function CardSearch({ onCardSelect }) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // APIリクエスト中かどうかの状態

  // Scryfall Autocomplete APIのURL
  const SCRYFALL_AUTOCOMPLETE_URL = 'https://api.scryfall.com/cards/autocomplete';

  useEffect(() => {
    if (searchText.trim() === '') {
      setSuggestions([]);
      return;
    }

    setLoading(true); // APIリクエスト開始

    // 500ミリ秒後に実行されるタイマーを設定
    const timer = setTimeout(async () => {
      try {
        // lang=jaを削除し、英語でのオートコンプリートを試す
        const response = await fetch(`${SCRYFALL_AUTOCOMPLETE_URL}?q=${searchText}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // --- デバッグ用ログ ---
        console.log('Scryfall APIからの生レスポンスデータ:', data);
        console.log('suggestionsにセットされるデータ:', data.data);
        // --- デバッグ用ログ ---

        setSuggestions(data.data || []); // 候補がなければ空配列
      } catch (error) {
        console.error('カード名のオートコンプリート中にエラーが発生しました:', error);
        setSuggestions([]);
      } finally {
        setLoading(false); // APIリクエスト終了
      }
    }, 500); // 500ミリ秒のデバウンス

    // クリーンアップ関数：前回のタイマーをクリアする
    return () => {
      clearTimeout(timer);
    };

  }, [searchText]); // searchTextが変更されるたびにこのeffectを実行

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  // 候補がクリックされた時のハンドラー
  const handleSuggestionClick = (name) => {
    setSearchText(name); // 検索ボックスに選択された名前を入れる
    setSuggestions([]); // 候補リストをクリアする
    onCardSelect(name); // 親コンポーネントに選択されたカード名を通知する
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="カード名を入力..."
        value={searchText}
        onChange={handleInputChange}
      />
      {loading && <p>検索中...</p>}
      <ul>
        {suggestions.map(name => (
          <li key={name} onClick={() => handleSuggestionClick(name)}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CardSearch;
