import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CardProvider } from './contexts/CardContext.jsx';
import { DndProvider } from 'react-dnd'; // DndProviderをインポート
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5Backendをインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}> {/* DndProviderでアプリケーションをラップ */}
      <CardProvider>
        <App />
      </CardProvider>
    </DndProvider>
  </React.StrictMode>,
)
