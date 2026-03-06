import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import { WELCOME_MESSAGE, SUGGESTED_QUESTIONS, SYSTEM_PROMPT } from '../data/systemPrompt'
import { getOfflineResponse } from '../data/offlineResponses'

function ChatInterface({ onMenuClick }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('offline') // 'offline' or 'api'
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return

    const userMessage = { role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      let response
      if (mode === 'api') {
        response = await fetchAPIResponse(updatedMessages)
      } else {
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800))
        response = getOfflineResponse(text)
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'API 연결에 문제가 있습니다. 오프라인 모드로 전환합니다.'
      }])
      setMode('offline')
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchAPIResponse(chatMessages) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatMessages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    })
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data.content
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleSuggestionClick(question) {
    sendMessage(question)
  }

  const showSuggestions = messages.length === 1

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="menu-button" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="chat-header-center">
          <h1 className="chat-title">Doner</h1>
          <span className="chat-subtitle">Coree's AI Portfolio Agent</span>
        </div>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'offline' ? 'mode-btn--active' : ''}`}
            onClick={() => setMode('offline')}
            title="오프라인 모드 (API 키 불필요)"
          >
            Offline
          </button>
          <button
            className={`mode-btn ${mode === 'api' ? 'mode-btn--active' : ''}`}
            onClick={() => setMode('api')}
            title="Claude API 연동 모드"
          >
            API
          </button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="message message--assistant">
            <div className="message-avatar">D</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        {showSuggestions && (
          <div className="suggestions">
            <p className="suggestions-label">이런 것들을 물어보실 수 있어요</p>
            <div className="suggestions-grid">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Coree에 대해 궁금한 것을 물어보세요..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">
          {mode === 'offline' ? '오프라인 모드 — 키워드 기반 응답' : 'API 모드 — Claude AI 실시간 응답'}
        </p>
      </form>
    </div>
  )
}

export default ChatInterface
