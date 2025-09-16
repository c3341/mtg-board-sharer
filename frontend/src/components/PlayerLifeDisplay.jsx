import React from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';

function PlayerLifeDisplay({ playerType }) {
  const { myLife, setMyLife, opponentLife, setOpponentLife } = usePlayerContext();

  // currentLifeは数値だが、inputのvalueは文字列なので、
  // 数値が0の場合に空文字列を返すように調整
  const currentLifeValue = (playerType === 'my' ? myLife : opponentLife);
  const displayValue = currentLifeValue === 0 ? '' : currentLifeValue; // 0の場合は空文字列を表示

  const displayName = playerType === 'my' ? '自分のライフ' : '相手のライフ';

  const handleLifeChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue === '') {
      // 入力が空文字列の場合、stateも空文字列にする
      if (playerType === 'my') {
        setMyLife(''); // 数値ではなく空文字列をセット
      } else if (playerType === 'opponent') {
        setOpponentLife(''); // 数値ではなく空文字列をセット
      }
    } else {
      const newValue = parseInt(inputValue, 10);
      if (playerType === 'my') {
        setMyLife(isNaN(newValue) ? 0 : newValue); // 無効な値は0に
      } else if (playerType === 'opponent') {
        setOpponentLife(isNaN(newValue) ? 0 : newValue); // 無効な値は0に
      }
    }
  };

  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '5px', textAlign: 'center' }}>
      <h4>{displayName}</h4>
      <input
        type="number"
        value={displayValue} // ここで調整した値を使う
        onChange={handleLifeChange}
        style={{ fontSize: '2em', fontWeight: 'bold', width: '80px', textAlign: 'center' }}
      />
    </div>
  );
}

export default PlayerLifeDisplay;
