import React, { createContext, useContext, useState } from 'react';

const CardContext = createContext(null);

export const CardProvider = ({ children }) => {
  // カードのリストを管理するstate。各カードオブジェクトにzoneプロパティを追加する
  const [cards, setCards] = useState([]);

  // カードを追加する関数。デフォルトで「自分の手札」に追加する
  const addCard = (newCard) => {
    // 新しいカードオブジェクトにzoneプロパティを追加
    const cardWithZone = { ...newCard, zone: 'myHand' }; // デフォルトゾーンをmyHandに設定
    setCards(prevCards => [...prevCards, cardWithZone]);
  };

  // カードのゾーンを更新する関数（後でドラッグ＆ドロップで使う）
  const moveCard = (cardId, newZone) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, zone: newZone } : card
      )
    );
  };

  // Contextを通じて提供する値
  const contextValue = {
    cards,
    addCard,
    moveCard, // moveCard関数も提供する
  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};