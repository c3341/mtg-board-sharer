import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CardProvider } from './contexts/CardContext.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PlayerProvider } from './contexts/PlayerContext.jsx'; // PlayerProviderをインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <PlayerProvider> {/* PlayerProviderでCardProviderをラップ */}
        <CardProvider>
          <App />
        </CardProvider>
      </PlayerProvider>
    </DndProvider>
  </React.StrictMode>,
)