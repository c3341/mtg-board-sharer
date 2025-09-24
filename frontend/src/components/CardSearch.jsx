import { useState, useEffect, useRef, forwardRef } from 'react';

const CardSearch = forwardRef(({ onCardSelect }, ref) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef(null); // 検索コンポーネント全体への参照

  // Scryfall Search APIのURL
  const SCRYFALL_SEARCH_URL = 'https://api.scryfall.com/cards/search';

  // --- 検索欄の外側をクリックしたときに候補を閉じる処理 ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    // イベントリスナーを登録
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // クリーンアップ
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);


  // --- searchTextが変更されたときにAPIを叩く処理 ---
  useEffect(() => {
    if (searchText.trim() === '') {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        // 日本語での部分一致検索を行うようにクエリを構築
        const query = `name:/"${searchText}" lang:ja`;
        const response = await fetch(`${SCRYFALL_SEARCH_URL}?q=${encodeURIComponent(query)}&unique=cards`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        // APIのレスポンスはカードオブジェクトの配列
        setSuggestions(data.data || []);
      } catch (error) {
        console.error('カード検索中にエラーが発生しました:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  // --- イベントハンドラ --- 

  // 入力変更：日本語入力を許可
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  // 候補クリック：カードオブジェクト全体を渡す
  const handleSuggestionClick = (cardObject) => {
    onCardSelect(cardObject);
    setSearchText(''); // 選択後は入力欄をクリア
    setSuggestions([]); // 選択後は候補をクリア
  };

  // クリアボタンクリック
  const handleClear = () => {
    setSearchText('');
    setSuggestions([]);
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
        ref={ref} // 親から渡されたrefを入力欄に設定
        type="text"
        placeholder="Search for a card..."
        value={searchText}
        onChange={handleInputChange}
      />
      {/* 検索テキストがある場合にクリアボタンを表示 */}
      {searchText && (
        <button onClick={handleClear} className="clear-button">
          ×
        </button>
      )}

      {loading && <div className="loading-spinner"></div>}

      {/* 候補リスト */}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map(card => (
            <li key={card.id} onClick={() => handleSuggestionClick(card)}>
              {/* 日本語名があれば表示、なければ英語名 */}
              {card.printed_name || card.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default CardSearch;
