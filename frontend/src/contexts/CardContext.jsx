import React, { createContext, useContext, useState } from 'react';

// 1. Contextオブジェクトを作成
const CardContext = createContext(null);

// 2. Contextを提供するプロバイダーコンポーネント
export const CardProvider = ({ children }) => {
  // カードのリストを管理するstateをここに置く
  const [cards, setCards] = useState([]);

  // カードを追加する関数（例）
  const addCard = (newCard) => {
    setCards(prevCards => [...prevCards, newCard]);
  };

  // Contextを通じて提供する値
  const contextValue = {
    cards, // 現在のカードリスト
    addCard, // カードを追加する関数
    // 他にも、removeCard, moveCardなどの関数を追加していく
  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};

// 3. Contextを利用するためのカスタムフック
export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};
