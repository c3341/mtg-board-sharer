import React from 'react';
import { useCardContext } from '../contexts/CardContext';
import DraggableCard from './DraggableCard';
import { useDrop } from 'react-dnd'; // useDropをインポート

function Hand({ zoneType }) {
  const { cards, moveCard } = useCardContext(); // moveCardもContextから取得

  const filteredCards = cards.filter(card => card.zone === zoneType);

  const zoneDisplayName = {
    myHand: '自分の手札',
    opponentHand: '相手の手札',
  }[zoneType] || '手札';

  // useDropフックを使って、このコンポーネントをドロップ可能にする
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card', // 'card'タイプのアイテムを受け入れる
    drop: (item, monitor) => {
      // ドロップされたアイテムのIDと、このゾーンのzoneTypeを使ってmoveCardを呼び出す
      moveCard(item.id, zoneType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // ドロップターゲットの上にドラッグ中のアイテムがあるか監視
    }),
  }));

  return (
    // drop refをDOM要素にアタッチすることで、その要素がドロップ可能になる
    <div
      ref={drop} // drop refをアタッチ
      className="zone-box"
      style={{ backgroundColor: isOver ? 'lightblue' : 'white' }} // ホバー時に色を変える
    >
      <h3>{zoneDisplayName}</h3>
      {filteredCards.length === 0 ? (
        <p>{zoneDisplayName}にカードはありません。</p>
      ) : (
        <div className="zone-row">
          {filteredCards.map(card => (
            <DraggableCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Hand;
