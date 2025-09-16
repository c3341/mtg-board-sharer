import { useState } from 'react';

// Appコンポーネントから渡された { cardNameList } をpropsとして受け取る
function CardSearch({ cardNameList }) {
  const [searchText, setSearchText] = useState('');
  // 検索結果の候補を保存するための新しいstate
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);

    // 入力された文字に基づいて、カード名のリストをフィルタリングする
    if (newSearchText.length > 0) {
      const filteredSuggestions = cardNameList.filter(name =>
        // 大文字・小文字を区別せずに部分一致で検索
        name.toLowerCase().includes(newSearchText.toLowerCase())
      );
      // パフォーマンスのため、候補は最大10件まで表示
      setSuggestions(filteredSuggestions.slice(0, 10)); 
    } else {
      // 入力が空なら候補も空にする
      setSuggestions([]); 
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="カード名を入力..."
        value={searchText}
        onChange={handleInputChange}
      />
      {/* 候補リストの表示 */}
      <ul>
        {suggestions.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CardSearch;
