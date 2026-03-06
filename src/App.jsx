import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <ChatInterface onMenuClick={() => setSidebarOpen(true)} />
      </main>
    </div>
  )
}

export default App
