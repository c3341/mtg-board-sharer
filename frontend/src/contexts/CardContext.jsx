import React, { createContext, useContext, useState } from 'react';

const CardContext = createContext(null);

export const CardProvider = ({ children }) => {
  // カードのリストを管理するstate。各カードオブジェクトにzoneプロパティを追加する
  const [cards, setCards] = useState([]);

  // カードを追加する関数。デフォルトで「自分の手札」に追加する
  const addCard = (newCard) => {
    // 新しいカードオブジェクトにユニークなinstanceIdとzoneプロパティを追加
    const cardWithInstanceId = { 
      ...newCard, 
      instanceId: crypto.randomUUID(), // ユニークIDを付与
      zone: 'myHand',
      isTapped: false, // isTappedプロパティを追加
    };
    setCards(prevCards => [...prevCards, cardWithInstanceId]);
  };

  // カードのゾーンを更新する関数
  const moveCard = (cardInstanceId, newZone) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.instanceId === cardInstanceId ? { ...card, zone: newZone } : card
      )
    );
  };

  // カードのタップ状態を切り替える関数
  const toggleTap = (cardInstanceId) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.instanceId === cardInstanceId ? { ...card, isTapped: !card.isTapped } : card
      )
    );
  };

  // Contextを通じて提供する値
  const contextValue = {
    cards,
    addCard,
    moveCard,
    toggleTap, // toggleTap関数も提供する
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