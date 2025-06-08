import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/authContext.jsx'
import { ChatProvider } from './context/chatContext.jsx'

createRoot(document.getElementById('root')).render(

      <AuthProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </AuthProvider>

)
