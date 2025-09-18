import { useState, useEffect, useRef } from 'react';

function CardSearch({ onCardSelect }) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef(null); // 検索コンポーネント全体への参照

  // Scryfall Autocomplete APIのURL
  const SCRYFALL_AUTOCOMPLETE_URL = 'https://api.scryfall.com/cards/autocomplete';

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
        const response = await fetch(`${SCRYFALL_AUTOCOMPLETE_URL}?q=${searchText}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setSuggestions(data.data || []);
      } catch (error) {
        console.error('カード名のオートコンプリート中にエラーが発生しました:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // デバウンス時間を少し短縮

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  // --- イベントハンドラ --- 

  // 入力変更：全角を半角に変換し、半角英字と一部記号のみを許可
  const handleInputChange = (event) => {
    const rawValue = event.target.value;
    // 全角英数字・スペースを半角に変換
    const halfWidthValue = rawValue.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    );
    // 半角英字、スペース、一部の記号以外を削除
    const sanitizedValue = halfWidthValue.replace(/[^a-zA-Z\s'-]/g, '');
    setSearchText(sanitizedValue);
  };

  // 候補クリック：カード選択を通知するのみ（連続選択のため）
  const handleSuggestionClick = (name) => {
    onCardSelect(name);
    // setSearchText(''); // 入力欄をクリアすると、useEffectが発火して候補が消えるため、クリアしない
    // setSuggestions([]); // 候補リストもクリアしない
  };

  // クリアボタンクリック
  const handleClear = () => {
    setSearchText('');
    setSuggestions([]);
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
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
          {suggestions.map(name => (
            <li key={name} onClick={() => handleSuggestionClick(name)}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CardSearch;
