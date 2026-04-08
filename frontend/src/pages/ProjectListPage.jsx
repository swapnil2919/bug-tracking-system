import { useState } from 'react'

export function ProjectListPage({ users, projects, onOpenProject, onCreateUser, onCreateProject }) {
  const [userForm, setUserForm] = useState({ name: '', email: '' })
  const [projectForm, setProjectForm] = useState({ name: '', description: '', created_by: '' })

  async function handleCreateUser(event) {
    event.preventDefault()
    await onCreateUser(userForm)
    setUserForm({ name: '', email: '' })
  }

  async function handleCreateProject(event) {
    event.preventDefault()
    await onCreateProject({
      name: projectForm.name,
      description: projectForm.description,
      created_by: Number(projectForm.created_by),
    })
    setProjectForm({ name: '', description: '', created_by: '' })
  }

  return (
    <section className="page-grid">
      <div className="card">
        <h2>Project List Page</h2>
        <p className="muted">Click a project to open its issue list.</p>

        <div className="list">
          {projects.map((project) => (
            <button className="list-item" key={project.id} onClick={() => onOpenProject(project)}>
              <strong>{project.name}</strong>
              <span>{project.description || 'No description'}</span>
            </button>
          ))}

          {!projects.length && <p className="empty">No projects found.</p>}
        </div>
      </div>

      <aside className="card side-card">
        <h2>Basic setup</h2>

        <form onSubmit={handleCreateUser} className="form">
          <h3>Create user</h3>
          <input
            required
            minLength={2}
            placeholder="Name"
            value={userForm.name}
            onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={userForm.email}
            onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
          />
          <button>Create user</button>
        </form>

        <form onSubmit={handleCreateProject} className="form">
          <h3>Create project</h3>
          <input
            required
            minLength={2}
            placeholder="Project name"
            value={projectForm.name}
            onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })}
          />
          <textarea
            placeholder="Description"
            value={projectForm.description}
            onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
          />
          <select
            required
            value={projectForm.created_by}
            onChange={(event) => setProjectForm({ ...projectForm, created_by: event.target.value })}
          >
            <option value="">Created by</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button disabled={!users.length}>Create project</button>
        </form>
      </aside>
    </section>
  )
}
