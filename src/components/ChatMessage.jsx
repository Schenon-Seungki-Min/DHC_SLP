function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant'

  function renderContent(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      const lines = part.split('\n')
      return lines.map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ))
    })
  }

  return (
    <div className={`message message--${isAssistant ? 'assistant' : 'user'}`}>
      {isAssistant && <div className="message-avatar">D</div>}
      <div className="message-content">
        <div className="message-text">
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
