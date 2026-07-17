function StatusMessage({ type = 'info', children }) {
  return <div className={`status-message status-message--${type}`}>{children}</div>
}

export default StatusMessage
