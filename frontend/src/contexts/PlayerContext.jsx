import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [myLife, setMyLife] = useState(20); // 自分のライフ初期値
  const [opponentLife, setOpponentLife] = useState(20); // 相手のライフ初期値

  // adjustLife関数は不要になるため削除
  // const adjustLife = (player, amount) => {
  //   if (player === 'my') {
  //     setMyLife(prevLife => prevLife + amount);
  //   } else if (player === 'opponent') {
  //     setOpponentLife(prevLife => prevLife + amount);
  //   }
  // };

  const contextValue = {
    myLife,
    setMyLife, // 直接セットもできるように提供
    opponentLife,
    setOpponentLife,
    // adjustLifeは削除
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};