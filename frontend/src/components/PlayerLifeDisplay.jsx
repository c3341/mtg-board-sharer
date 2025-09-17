import React from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';

function PlayerLifeDisplay({ playerType }) {
  const { myLife, setMyLife, opponentLife, setOpponentLife } = usePlayerContext();

  const currentLifeValue = (playerType === 'my' ? myLife : opponentLife);
  const displayValue = currentLifeValue === '' ? '' : currentLifeValue; // 0の場合は空文字列を表示

  const displayName = playerType === 'my' ? 'Player' : 'Opponent';

  const handleLifeChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue === '') {
      if (playerType === 'my') {
        setMyLife('');
      } else if (playerType === 'opponent') {
        setOpponentLife('');
      }
    } else {
      const newValue = parseInt(inputValue, 10);
      if (playerType === 'my') {
        setMyLife(isNaN(newValue) ? 0 : newValue);
      } else if (playerType === 'opponent') {
        setOpponentLife(isNaN(newValue) ? 0 : newValue);
      }
    }
  };

  return (
    <div className="life-counter-box"> {/* 新しいクラス名 */}
      <h4>{displayName}</h4>
      <input
        type="number"
        value={displayValue}
        onChange={handleLifeChange}
      /> {/* インラインスタイルを削除 */}
    </div>
  );
}

export default PlayerLifeDisplay;