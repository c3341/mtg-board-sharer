import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CardProvider } from './contexts/CardContext.jsx'; // CardProviderをインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CardProvider> {/* AppコンポーネントをCardProviderでラップ */}
      <App />
    </CardProvider>
  </React.StrictMode>,
)