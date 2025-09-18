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
      isTapped: false,
      isFaceDown: false,
      counters: [], // カウンタープロパティを初期化
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

  // カードの裏向き状態を切り替える関数
  const toggleFaceDown = (cardInstanceId) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.instanceId === cardInstanceId ? { ...card, isFaceDown: !card.isFaceDown } : card
      )
    );
  };

  // カードを削除する関数
  const deleteCard = (cardInstanceId) => {
    setCards(prevCards => prevCards.filter(card => card.instanceId !== cardInstanceId));
  };

  // カードを複製する関数
  const duplicateCard = (cardInstanceId) => {
    const cardToDuplicate = cards.find(card => card.instanceId === cardInstanceId);
    if (cardToDuplicate) {
      const newCard = {
        ...cardToDuplicate,
        instanceId: crypto.randomUUID(),
        // 複製されたカードはタップやカウンターの状態を引き継がない方が自然な場合もあるが、一旦すべて引き継ぐ
      };
      
      // 元のカードのインデックスを見つけて、その隣に複製を追加する
      const originalIndex = cards.findIndex(card => card.instanceId === cardInstanceId);
      const newCards = [...cards];
      newCards.splice(originalIndex + 1, 0, newCard);
      setCards(newCards);
    }
  };

  // カードにカウンターを置く関数（一旦、種類は+1/+1で固定）
  const addCounter = (cardInstanceId) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.instanceId === cardInstanceId) {
          // countersプロパティがなければ初期化
          const newCounters = card.counters ? [...card.counters] : [];
          newCounters.push({ id: crypto.randomUUID(), type: '+1/+1' });
          return { ...card, counters: newCounters };
        }
        return card;
      })
    );
  };

  // Contextを通じて提供する値
  const contextValue = {
    cards,
    addCard,
    moveCard,
    toggleTap,
    toggleFaceDown,
    deleteCard,
    duplicateCard,
    addCounter,
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