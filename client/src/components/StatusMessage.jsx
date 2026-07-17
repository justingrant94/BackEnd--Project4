function StatusMessage({ type = 'info', loading = false, title, children }) {
  return (
    <div className={`status-message status-message--${type}`} role="status" aria-live="polite">
      {loading && <span className="status-message__spinner" aria-hidden="true" />}
      <div>
        {title && <strong>{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  )
}

export default StatusMessage
