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
      zone: 'myNonLand', // デフォルトの配置場所を非土地ゾーンに変更
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

  // カードに指定した数のカウンターを置く関数
  const addCounters = (cardInstanceId, amount) => {
    if (amount <= 0) return; // 0以下の場合は何もしない

    setCards(prevCards =>
      prevCards.map(card => {
        if (card.instanceId === cardInstanceId) {
          const newCounters = card.counters ? [...card.counters] : [];
          for (let i = 0; i < amount; i++) {
            newCounters.push({ id: crypto.randomUUID(), type: '+1/+1' });
          }
          return { ...card, counters: newCounters };
        }
        return card;
      })
    );
  };

  // 盤面全体を新しいカード配列で上書きする関数
  const overwriteCards = (newCards) => {
    setCards(newCards);
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
    addCounters, // addCounterからaddCountersに変更
    overwriteCards,
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