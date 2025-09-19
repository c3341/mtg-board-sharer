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

    const cloneContainer = document.createElement('div');
    const appContainer = document.querySelector('.app-container');
    Object.assign(cloneContainer.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      padding: '20px',
      backgroundColor: '#1a1a1a',
      width: appContainer ? appContainer.offsetWidth + 'px' : '1200px',
    });

    const elementSelectors = ['.opponent-hand-area', '.game-board', '.hand-area.player-hand-area'];
    elementSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        const clonedElement = element.cloneNode(true);
        cloneContainer.appendChild(clonedElement);
      }
    });

    cloneContainer.querySelectorAll('.life-counter-box input').forEach(input => {
      const lifeValue = input.value;
      const lifeDiv = document.createElement('div');
      lifeDiv.textContent = lifeValue;
      Object.assign(lifeDiv.style, {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        width: '100px',
        textAlign: 'center',
        color: '#f0f0f0',
        height: '3rem',
        lineHeight: '3rem',
      });
      input.parentNode.replaceChild(lifeDiv, input);
    });

    document.body.appendChild(cloneContainer);

    try {
      // ★タップされたカードをCanvasに置き換える処理
      const tappedCardElements = cloneContainer.querySelectorAll('.card-item.tapped');
      const promises = Array.from(tappedCardElements).map(async (cardElement) => {
        const img = cardElement.querySelector('img');
        if (!img || !img.src) return;

        return new Promise((resolve, reject) => {
          const originalImage = new Image();
          originalImage.crossOrigin = 'Anonymous'; // CORS対応
          originalImage.src = img.src;
          originalImage.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // カードの元のサイズを取得 (CSSで指定されている想定)
            const originalWidth = cardElement.clientWidth;
            const originalHeight = cardElement.clientHeight;

            // 回転後は幅と高さが入れ替わる
            canvas.width = originalHeight;
            canvas.height = originalWidth;

            // Canvasの中心に移動し、90度回転
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(90 * Math.PI / 180);

            // 画像を描画 (中心から描画するため、幅/高さの半分を引く)
            ctx.drawImage(originalImage, -originalWidth / 2, -originalHeight / 2, originalWidth, originalHeight);

            // 元のカード要素を生成したCanvasに置き換える
            cardElement.parentNode.replaceChild(canvas, cardElement);
            resolve();
          };
          originalImage.onerror = reject;
        });
      });

      // すべての画像処理が終わるのを待つ
      await Promise.all(promises);

      const canvas = await html2canvas(cloneContainer, {
        useCORS: true,
        backgroundColor: '#1a1a1a',
        windowWidth: cloneContainer.scrollWidth,
        windowHeight: cloneContainer.scrollHeight,
      });
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);

      // ローカル保存のロジック
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'mtg-board.jpg'; // ダウンロード時のファイル名
      document.body.appendChild(link); // DOMに追加しないとclick()が動作しないブラウザがある
      link.click(); // ダウンロードをトリガー
      document.body.removeChild(link); // 不要になったaタグを削除

      alert('盤面画像をダウンロードしました！'); // ダウンロード完了を通知

    } catch (error) {
      console.error('画像共有中にエラーが発生しました:', error);
      alert('画像保存中にエラーが発生しました。');
    } finally {
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
          {isSharing ? '生成中...' : 'Save image'} {/* テキスト変更 */}
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