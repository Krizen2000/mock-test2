import axios from 'axios'

export type Project = {
  _id: string
  title: string
  description: string
  imageUrl: string
  githubUrl: string
  deployUrl: string
  email: string
  password: string
}

async function getProjects() {
  const token = window.localStorage.getItem('token')
  if (!token) {
    console.log('Token not found')

    return null
  }
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3120',
    headers: { Authorization: `bearer ${token}` }
  })
  let projects: Project[] | null
  try {
    const res = await axiosInstance.get('api/projects/all')
    projects = res.data.projects
    console.log('projects:', projects)
  } catch (err) {
    console.log(err)

    return null
  }
  if (!projects) return null

  return projects
}

async function deleteProject(id: string): Promise<void | never> {
  const token = window.localStorage.getItem('token')
  if (!token) {
    console.log('Something went wrong')

    return
  }
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3120',
    headers: { Authorization: `bearer ${token}` }
  })
  try {
    await axiosInstance.delete(`api/projects/${id}`)
  } catch (err) {
    console.log(err)
  }
}

export { getProjects, deleteProject }
