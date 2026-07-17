import { useState } from 'react'

function getInitials(label = '') {
  return label
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function SafeImage({ src, alt, className = '', fallbackLabel = alt, ...props }) {
  const [failed, setFailed] = useState(!src)

  return (
    <div className={`safe-image ${className}`} aria-label={alt || fallbackLabel}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          {...props}
        />
      )}
      {failed && <span>{getInitials(fallbackLabel) || 'BIG'}</span>}
    </div>
  )
}

export default SafeImage