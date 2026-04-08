import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

export const apiClient = {
  getDashboard: () => api.get('/dashboard').then((res) => res.data),
  listUsers: () => api.get('/users').then((res) => res.data),
  createUser: (data) => api.post('/users', data).then((res) => res.data),
  listProjects: () => api.get('/projects').then((res) => res.data),
  createProject: (data) => api.post('/projects', data).then((res) => res.data),
  listProjectIssues: (projectId, search = '') =>
    api
      .get(`/projects/${projectId}/issues`, { params: search ? { search } : undefined })
      .then((res) => res.data),
  getIssue: (issueId) => api.get(`/issues/${issueId}`).then((res) => res.data),
  createIssue: (data) => api.post('/issues', data).then((res) => res.data),
  updateIssueStatus: (issueId, status) =>
    api.put(`/issues/${issueId}/status`, { status }).then((res) => res.data),
  updateIssuePriority: (issueId, priority) =>
    api.put(`/issues/${issueId}/priority`, { priority }).then((res) => res.data),
  assignIssue: (issueId, assignedTo) =>
    api.put(`/issues/${issueId}/assign`, { assigned_to: assignedTo }).then((res) => res.data),
  listComments: (issueId) => api.get(`/issues/${issueId}/comments`).then((res) => res.data),
  createComment: (issueId, data) =>
    api.post(`/issues/${issueId}/comments`, data).then((res) => res.data),
}
