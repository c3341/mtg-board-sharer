import React from 'react';
import { useCardContext } from '../contexts/CardContext';
import DraggableCard from './DraggableCard';
import { useDrop } from 'react-dnd'; // useDropをインポート

function Battlefield({ zoneType }) {
  const { cards, moveCard } = useCardContext(); // moveCardもContextから取得

  const filteredCards = cards.filter(card => card.zone === zoneType);

  const zoneDisplayName = {
    myBattlefield: '自分の戦場',
    opponentBattlefield: '相手の戦場',
  }[zoneType] || '戦場';

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
      style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }} // ホバー時に色を変える
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

export default Battlefield;
