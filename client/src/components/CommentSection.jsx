import { useState } from 'react'
import { createComment, deleteComment } from '../api/client'
import { isLoggedIn } from '../lib/auth'
import StatusMessage from './StatusMessage'

function CommentSection({ playerId, comments = [], onChanged }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const loggedIn = isLoggedIn()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!text.trim()) {
      setError('Add a comment before posting.')
      return
    }

    try {
      setSubmitting(true)
      await createComment({ text, basketball: playerId })
      setText('')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(commentId) {
    setError('')

    try {
      await deleteComment(commentId)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="comments-panel">
      <div className="section-heading">
        <p className="eyebrow">Fan notes</p>
        <h2>Comments</h2>
      </div>

      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {loggedIn ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add your take on this player..."
            rows="4"
          />
          <button className="button" type="submit" disabled={submitting}>{submitting ? 'Posting...' : 'Post comment'}</button>
        </form>
      ) : (
        <StatusMessage>Login to add comments and keep the player discussion tidy.</StatusMessage>
      )}

      <div className="comment-list">
        {comments.length ? comments.map((comment) => (
          <article className="comment-card" key={comment.id}>
            <p>{comment.text}</p>
            <div>
              <span>{comment.owner?.username || 'User'}</span>
              {loggedIn && (
                <button type="button" onClick={() => handleDelete(comment.id)}>Delete</button>
              )}
            </div>
          </article>
        )) : <p className="muted">No comments yet.</p>}
      </div>
    </section>
  )
}

export default CommentSection
