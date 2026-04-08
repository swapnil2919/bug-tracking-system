import { useState } from 'react'

const statuses = ['OPEN', 'IN_PROGRESS', 'DONE']
const priorities = ['LOW', 'MEDIUM', 'HIGH']

export function IssueListPage({
  users,
  project,
  issues,
  onBack,
  onOpenIssue,
  onChangeStatus,
  onAssignIssue,
  onChangePriority,
  onCreateIssue,
}) {
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigned_to: '',
  })

  async function handleCreateIssue(event) {
    event.preventDefault()
    await onCreateIssue({
      title: issueForm.title,
      description: issueForm.description,
      priority: issueForm.priority,
      project_id: project.id,
      assigned_to: issueForm.assigned_to ? Number(issueForm.assigned_to) : null,
    })
    setIssueForm({ title: '', description: '', priority: 'MEDIUM', assigned_to: '' })
  }

  return (
    <section className="card">
      <div className="page-title">
        <div>
          <button className="text-button" onClick={onBack}>Back to projects</button>
          <h2>Issue List Page</h2>
          <p className="muted">{project.name}</p>
        </div>
      </div>

      <form onSubmit={handleCreateIssue} className="issue-form">
        <input
          required
          minLength={2}
          placeholder="Issue title"
          value={issueForm.title}
          onChange={(event) => setIssueForm({ ...issueForm, title: event.target.value })}
        />
        <select
          value={issueForm.priority}
          onChange={(event) => setIssueForm({ ...issueForm, priority: event.target.value })}
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <select
          value={issueForm.assigned_to}
          onChange={(event) => setIssueForm({ ...issueForm, assigned_to: event.target.value })}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={issueForm.description}
          onChange={(event) => setIssueForm({ ...issueForm, description: event.target.value })}
        />
        <button>Create issue</button>
      </form>

      <div className="table">
        <div className="table-row table-head">
          <span>Title</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Assigned user</span>
          <span>Action</span>
        </div>

        {issues.map((issue) => (
          <div className="table-row" key={issue.id}>
            <strong>{issue.title}</strong>
            <select value={issue.status} onChange={(event) => onChangeStatus(issue, event.target.value)}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select value={issue.priority} onChange={(event) => onChangePriority(issue, event.target.value)}>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <select
              value={issue.assigned_to ?? ''}
              onChange={(event) => onAssignIssue(issue, event.target.value ? Number(event.target.value) : null)}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button onClick={() => onOpenIssue(issue)}>Details</button>
          </div>
        ))}

        {!issues.length && <p className="empty">No issues found for this project.</p>}
      </div>
    </section>
  )
}
