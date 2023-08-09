import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Project } from './helpers'
import Image from 'next/image'

async function getProject(id: string) {
  const token = window.localStorage.getItem('token')
  if (!token) {
    console.log('Something went wrong')

    return null
  }
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3120',
    headers: { Authorization: `bearer ${token}` }
  })
  let project: Project | null
  try {
    console.log(id)
    const res = await axiosInstance.get(`api/projects/search?projectId=${id}`)
    project = res.data
    console.log('project:', project)
  } catch (err) {
    console.log(err)

    return null
  }
  if (!project) return null

  return project
}

type Props = {
  id: string | null
  openViewDialog: boolean
  closeViewDialogFunc: () => void
}

const ViewDialog: React.FC<Props> = props => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [deployUrl, setDeployUrl] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const init = async () => {
      if (!props.id) return

      const project = await getProject(props.id)
      if (!project) return
      setTitle(project.title)
      setDescription(project.description)
      setImageUrl(project.imageUrl)
      setGithubUrl(project.githubUrl)
      setDeployUrl(project.deployUrl)
      setEmail(project.email)
      setPassword(project.password)
    }
    init()
  }, [props.id, props.openViewDialog])

  return (
    <Dialog open={props.openViewDialog} onClose={props.closeViewDialogFunc}>
      <DialogTitle>Project: {props.id}</DialogTitle>
      <DialogContent>
        <TextField
          value={title}
          disabled
          autoFocus
          fullWidth
          placeholder='Title'
          style={{ marginTop: 20 }}
          label='Title'
        />
        <TextField
          value={description}
          disabled
          autoFocus
          fullWidth
          placeholder='Description'
          style={{ marginTop: 20 }}
          label='Description'
        />
        <Grid display={'grid'} justifyItems={'center'} margin={5}>
          <Image
            src={imageUrl.length > 50 ? imageUrl : ''}
            alt={`${title} image`}
            height={300}
            width={0}
            style={{ width: '100%', borderRadius: '0.5rem' }}
          />
        </Grid>
        <TextField
          value={githubUrl}
          disabled
          autoFocus
          fullWidth
          placeholder='GithubUrl'
          style={{ marginTop: 20 }}
          label='GithubUrl'
        />
        <TextField
          value={deployUrl}
          disabled
          autoFocus
          fullWidth
          placeholder='DeployUrl'
          style={{ marginTop: 20 }}
          label='DeployUrl'
        />
        <TextField
          value={email}
          disabled
          autoFocus
          fullWidth
          placeholder='Email'
          style={{ marginTop: 20 }}
          label='Email'
        />
        <TextField
          value={password}
          disabled
          autoFocus
          fullWidth
          placeholder='Password'
          style={{ marginTop: 20 }}
          label='Password'
        />
      </DialogContent>
      <DialogActions style={{ marginTop: 20 }}>
        <Button variant='contained' onClick={props.closeViewDialogFunc}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewDialog
