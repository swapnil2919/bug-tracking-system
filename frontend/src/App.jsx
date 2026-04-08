import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import './App.css'
import { apiClient } from './api'
import { IssueDetailPage } from './pages/IssueDetailPage'
import { IssueListPage } from './pages/IssueListPage'
import { ProjectListPage } from './pages/ProjectListPage'

const issuesPerPage = 10
const emptyDashboard = {
  total_projects: 0,
  total_issues: 0,
  open_issues: 0,
  in_progress_issues: 0,
  done_issues: 0,
}

function getErrorMessage(error) {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') {
      return detail
    }
  }

  return 'Something went wrong. Please make sure the backend is running.'
}

function App() {
  const [page, setPage] = useState('projects')
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [issues, setIssues] = useState([])
  const [issuePage, setIssuePage] = useState(1)
  const [totalIssues, setTotalIssues] = useState(0)
  const [comments, setComments] = useState([])
  const [dashboard, setDashboard] = useState(emptyDashboard)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadInitialData() {
    setLoading(true)
    setError('')

    try {
      const dashboardData = await apiClient.getDashboard()
      const userList = await apiClient.listUsers()
      const projectList = await apiClient.listProjects()

      setDashboard(dashboardData)
      setUsers(userList)
      setProjects(projectList)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function loadIssues(project, pageNumber = 1) {
    setError('')
    setSelectedProject(project)
    setSelectedIssue(null)
    setComments([])
    setPage('issues')

    try {
      const issueResult = await apiClient.listProjectIssues(project.id, pageNumber, issuesPerPage)
      setIssues(issueResult.issues)
      setTotalIssues(issueResult.total)
      setIssuePage(pageNumber)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function loadIssuePage(pageNumber) {
    if (!selectedProject) return
    await loadIssues(selectedProject, pageNumber)
  }

  async function openIssue(issue) {
    setError('')
    setSelectedIssue(issue)
    setPage('issue-detail')

    try {
      const issueDetails = await apiClient.getIssue(issue.id)
      const commentList = await apiClient.listComments(issue.id)

      setSelectedIssue(issueDetails)
      setComments(commentList)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function createUser(data) {
    setError('')

    try {
      await apiClient.createUser(data)
      const userList = await apiClient.listUsers()
      setUsers(userList)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function createProject(data) {
    setError('')

    try {
      await apiClient.createProject(data)
      const dashboardData = await apiClient.getDashboard()
      const projectList = await apiClient.listProjects()

      setDashboard(dashboardData)
      setProjects(projectList)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function createIssue(data) {
    if (!selectedProject) return

    setError('')

    try {
      await apiClient.createIssue(data)
      const dashboardData = await apiClient.getDashboard()
      const issueResult = await apiClient.listProjectIssues(selectedProject.id, 1, issuesPerPage)

      setDashboard(dashboardData)
      setIssues(issueResult.issues)
      setTotalIssues(issueResult.total)
      setIssuePage(1)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function changeIssueStatus(issue, status) {
    if (!selectedProject) return

    setError('')

    try {
      const updatedIssue = await apiClient.updateIssueStatus(issue.id, status)
      const dashboardData = await apiClient.getDashboard()
      const issueResult = await apiClient.listProjectIssues(selectedProject.id, issuePage, issuesPerPage)

      setDashboard(dashboardData)
      setIssues(issueResult.issues)
      setTotalIssues(issueResult.total)
      if (selectedIssue?.id === updatedIssue.id) {
        setSelectedIssue(updatedIssue)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function assignIssue(issue, assignedTo) {
    if (!selectedProject) return

    setError('')

    try {
      const updatedIssue = await apiClient.assignIssue(issue.id, assignedTo)
      const issueResult = await apiClient.listProjectIssues(selectedProject.id, issuePage, issuesPerPage)

      setIssues(issueResult.issues)
      setTotalIssues(issueResult.total)
      if (selectedIssue?.id === updatedIssue.id) {
        setSelectedIssue(updatedIssue)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function changeIssuePriority(issue, priority) {
    if (!selectedProject) return

    setError('')

    try {
      const updatedIssue = await apiClient.updateIssuePriority(issue.id, priority)
      const issueResult = await apiClient.listProjectIssues(selectedProject.id, issuePage, issuesPerPage)

      setIssues(issueResult.issues)
      setTotalIssues(issueResult.total)
      if (selectedIssue?.id === updatedIssue.id) {
        setSelectedIssue(updatedIssue)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function addComment(issue, data) {
    setError('')

    try {
      await apiClient.createComment(issue.id, data)
      const commentList = await apiClient.listComments(issue.id)
      setComments(commentList)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Issue Tracking System</p>
          <h1>Issue tracker</h1>
        </div>
        <button onClick={loadInitialData}>Refresh</button>
      </header>

      <section className="dashboard">
        <article>
          <strong>{dashboard.total_projects}</strong>
          <span>Total projects</span>
        </article>
        <article>
          <strong>{dashboard.total_issues}</strong>
          <span>Total issues</span>
        </article>
        <article>
          <strong>{dashboard.open_issues}</strong>
          <span>Open issues</span>
        </article>
        <article>
          <strong>{dashboard.in_progress_issues}</strong>
          <span>In progress</span>
        </article>
        <article>
          <strong>{dashboard.done_issues}</strong>
          <span>Done issues</span>
        </article>
      </section>

      {error && <p className="error">{error}</p>}
      {loading && <p className="notice">Loading data from backend...</p>}

      {page === 'projects' && (
        <ProjectListPage
          users={users}
          projects={projects}
          onCreateUser={createUser}
          onCreateProject={createProject}
          onOpenProject={loadIssues}
        />
      )}

      {page === 'issues' && selectedProject && (
        <IssueListPage
          users={users}
          project={selectedProject}
          issues={issues}
          currentPage={issuePage}
          totalIssues={totalIssues}
          issuesPerPage={issuesPerPage}
          onBack={() => setPage('projects')}
          onCreateIssue={createIssue}
          onOpenIssue={openIssue}
          onChangeStatus={changeIssueStatus}
          onAssignIssue={assignIssue}
          onChangePriority={changeIssuePriority}
          onPageChange={loadIssuePage}
        />
      )}

      {page === 'issue-detail' && selectedIssue && (
        <IssueDetailPage
          users={users}
          issue={selectedIssue}
          comments={comments}
          onBack={() => setPage('issues')}
          onAddComment={addComment}
        />
      )}
    </main>
  )
}

export default App
