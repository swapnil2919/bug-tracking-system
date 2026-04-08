import { useState } from 'react'

export function IssueDetailPage({ users, issue, comments, onBack, onAddComment }) {
  const [commentForm, setCommentForm] = useState({ user_id: '', message: '' })

  async function handleAddComment(event) {
    event.preventDefault()
    await onAddComment(issue, {
      user_id: Number(commentForm.user_id),
      message: commentForm.message,
    })
    setCommentForm({ user_id: '', message: '' })
  }

  return (
    <section className="page-grid">
      <article className="card">
        <button className="text-button" onClick={onBack}>Back to issues</button>
        <h2>Issue Detail Page</h2>

        <div className="detail-box">
          <h3>{issue.title}</h3>
          <p>{issue.description || 'No description'}</p>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{issue.status}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{issue.priority}</dd>
            </div>
            <div>
              <dt>Assigned user</dt>
              <dd>{issue.assignee?.name ?? 'Unassigned'}</dd>
            </div>
          </dl>
        </div>
      </article>

      <aside className="card side-card">
        <h2>Comments</h2>

        <div className="comments">
          {comments.map((comment) => (
            <article className="comment" key={comment.id}>
              <strong>{comment.author.name}</strong>
              <p>{comment.message}</p>
            </article>
          ))}
          {!comments.length && <p className="empty">No comments yet.</p>}
        </div>

        <form onSubmit={handleAddComment} className="form">
          <h3>Add comment</h3>
          <select
            required
            value={commentForm.user_id}
            onChange={(event) => setCommentForm({ ...commentForm, user_id: event.target.value })}
          >
            <option value="">Comment as</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <textarea
            required
            placeholder="Message"
            value={commentForm.message}
            onChange={(event) => setCommentForm({ ...commentForm, message: event.target.value })}
          />
          <button>Add comment</button>
        </form>
      </aside>
    </section>
  )
}
