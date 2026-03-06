function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">D</span>
            <span className="sidebar-logo-text">Doner</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        <div className="sidebar-content">
          <div className="profile-section">
            <div className="profile-avatar">SK</div>
            <h3 className="profile-name">민승기 (Coree)</h3>
            <p className="profile-title">Digital Healthcare PM</p>
          </div>

          <div className="info-section">
            <h4 className="info-label">Current</h4>
            <p className="info-value">DHC 한독 — 디지털헬스케어 PM</p>
            <p className="info-detail">SleepQ 프로젝트 매니저</p>
          </div>

          <div className="info-section">
            <h4 className="info-label">Experience</h4>
            <p className="info-value">8년+ 디지털 헬스케어</p>
          </div>

          <div className="info-section">
            <h4 className="info-label">Key Skills</h4>
            <div className="tag-list">
              {[
                'Digital Health', 'PM / PO', 'Biz Dev',
                'AI 활용', '규제(FDA/식약처)', 'Data-driven',
                '0→1 런칭', 'SaaS', 'DTx'
              ].map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h4 className="info-label">AI Products</h4>
            <ul className="product-list">
              <li>DHC_PMO <span className="product-badge">Live</span></li>
              <li>DHC_SLP <span className="product-badge">Building</span></li>
              <li>KKAM_BIZ <span className="product-badge">Live</span></li>
              <li>Doner <span className="product-badge">v4</span></li>
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">
            Powered by Doner v4 — Coree's AI Agent
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
