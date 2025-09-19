import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas'; // html2canvasをインポート
import CardSearch from './components/CardSearch';
import Battlefield from './components/Battlefield';
import Hand from './components/Hand';
import PlayerLifeDisplay from './components/PlayerLifeDisplay';
import { useCardContext } from './contexts/CardContext';
import { useDrop } from 'react-dnd';
import DraggableCard from './components/DraggableCard';

// 暫定対応のDroppableSubZone
const DroppableSubZone = ({ zoneId, cards, moveCard }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item) => moveCard(item.instanceId, zoneId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  const filteredCards = cards.filter(card => card.zone === zoneId);
  return (
    <div 
      ref={drop} 
      className="sub-zone"
      style={{ backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent', height: '100%' }}
    >
      {filteredCards.map(card => (
        <DraggableCard key={card.instanceId} card={card} />
      ))}
    </div>
  );
};

function App() {
  const { addCard, cards, moveCard, overwriteCards } = useCardContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false); // 画像共有処理中のローディング状態

  // URLから盤面を復元する処理 (これは以前の実装のまま)
  useEffect(() => {
    const restoreBoardFromUrl = async () => {
      // ... (省略) ...
    };
    // restoreBoardFromUrl(); // スクショ共有機能と競合するため、一旦無効化
    setIsLoading(false); // すぐにメイン画面を表示
  }, [overwriteCards]);

  const handleCardSelect = async (cardName) => {
    const SCRYFALL_CARD_SEARCH_URL = `https://api.scryfall.com/cards/named`;
    try {
      const response = await fetch(`${SCRYFALL_CARD_SEARCH_URL}?exact=${encodeURIComponent(cardName)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const cardData = await response.json();
      addCard(cardData);
    } catch (error) {
      console.error('カード詳細情報の取得中にエラーが発生しました:', error);
    }
  };

  // 画像として共有する処理
  const handleShareAsImage = async () => {
    setIsSharing(true);

    // 1. クローン用のコンテナを準備
    const cloneContainer = document.createElement('div');
    // スタイルを適用して画面外に配置
    Object.assign(cloneContainer.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      padding: '20px', // 元のapp-containerのスタイルを参考に
      backgroundColor: '#1a1a1a',
      width: document.querySelector('.app-container').offsetWidth + 'px' // 幅を合わせる
    });

    // 2. キャプチャしたい要素をクローンしてコンテナに追加
    const elementSelectors = ['.opponent-hand-area', '.game-board', '.hand-area.player-hand-area'];
    elementSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        const clonedElement = element.cloneNode(true);
        cloneContainer.appendChild(clonedElement);
      }
    });

    // 3. クローンコンテナをDOMに追加
    document.body.appendChild(cloneContainer);

    try {
      // 4. html2canvasでクローンコンテナをキャプチャ
      const canvas = await html2canvas(cloneContainer, {
        useCORS: true,
        backgroundColor: '#1a1a1a',
        // windowWidthとwindowHeightを使って、スクロール領域全体をキャプチャ
        windowWidth: cloneContainer.scrollWidth,
        windowHeight: cloneContainer.scrollHeight,
      });
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);

      // デバッグ用に、生成した画像を新しいタブで開く
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${imageUrl}" alt="Generated Board" />`);
      } else {
        alert('ポップアップブロックにより、画像を表示できませんでした。');
      }

      // TODO: 画像アップロード処理を後で有効化する

    } catch (error) {
      console.error('画像共有中にエラーが発生しました:', error);
      alert('画像共有中にエラーが発生しました。');
    } finally {
      // 5. クリーンアップ
      document.body.removeChild(cloneContainer);
      setIsSharing(false);
    }
  };

  if (isLoading) {
    return <div className="loading-fullscreen"><h1>読み込み中...</h1><div className="loading-spinner-large"></div></div>;
  }

  return (
    <div className="app-container">
      <h1>MTG Board Sharer</h1>
      <div className="controls-container">
        <div className="search-container">
          <CardSearch onCardSelect={handleCardSelect} />
        </div>
        <button onClick={handleShareAsImage} className="share-button" disabled={isSharing}>
          {isSharing ? '生成中...' : '画像として共有'}
        </button>
      </div>

      <div className="opponent-hand-area">
        <Hand zoneType="opponentHand" />
      </div>

      <main className="game-board">
        <div className="player-info opponent-info">
          <PlayerLifeDisplay playerType="opponent" />
        </div>
        <div className="battlefield-area opponent-battlefield">
          <Battlefield playerType="opponent" />
        </div>
        <div className="side-info opponent-side">
           <DroppableSubZone zoneId="opponentSide" cards={cards} moveCard={moveCard} />
        </div>

        <div className="player-info my-info">
          <PlayerLifeDisplay playerType="my" />
        </div>
        <div className="battlefield-area my-battlefield">
          <Battlefield playerType="my" />
        </div>
        <div className="side-info my-side">
          <DroppableSubZone zoneId="mySide" cards={cards} moveCard={moveCard} />
        </div>
      </main>

      <div className="hand-area player-hand-area">
        <Hand zoneType="myHand" />
      </div>
    </div>
  );
}

export default App;