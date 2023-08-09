import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Project } from './helpers'
import { Cropper, ReactCropperElement } from 'react-cropper'
import { Box } from '@mui/system'

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

async function updateProject(id: string, project: Omit<Project, '_id'>) {
  const token = window.localStorage.getItem('token')
  if (!token) console.log('Something went wrong')

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3120',
    headers: { Authorization: `bearer ${token}` }
  })
  try {
    await axiosInstance.put(`api/projects/${id}`, project)
  } catch (err) {
    console.log(err)
  }
}

type Props = {
  id: string | null
  openEditDialog: boolean
  closeEditDialogFunc: () => void
  refreshProjects: () => void
}

const EditDialog: React.FC<Props> = props => {
  const [project, setProject] = useState<Project | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [deployUrl, setDeployUrl] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const cropperRef = useRef<ReactCropperElement>(null)

  const onImgChange = (e: any) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as any)
    reader.readAsDataURL(files[0])
  }

  const cropAction = () => {
    const cropperElement = cropperRef?.current
    const cropper = cropperElement?.cropper
    if (!cropper) return

    const croppedImageUrl = cropper.getCroppedCanvas().toDataURL()
    setImageUrl(croppedImageUrl)
  }
  const rotateAction = () => {
    const cropperElement = cropperRef?.current
    const cropper = cropperElement?.cropper
    if (!cropper) return

    cropper.rotate(90)
  }

  const resetAction = () => {
    if (!project) return
    setTitle(project.title)
    setDescription(project.description)
    setImageUrl(project.imageUrl)
    setGithubUrl(project.githubUrl)
    setDeployUrl(project.deployUrl)
    setEmail(project.email)
    setPassword(project.password)
  }
  const updateAction = () => {
    const condition = confirm(`Do you want to update (${project?.title})?`)
    if (!condition) return
    if (!props.id) return

    const data = { title, description, imageUrl, githubUrl, deployUrl, email, password }
    props.closeEditDialogFunc()
    updateProject(props.id, data).then(props.refreshProjects)
  }

  useEffect(() => {
    const init = async () => {
      if (!props.id) return

      const project = await getProject(props.id)
      if (!project) return
      setProject(project)
      setTitle(project.title)
      setDescription(project.description)
      setImageUrl(project.imageUrl)
      setGithubUrl(project.githubUrl)
      setDeployUrl(project.deployUrl)
      setEmail(project.email)
      setPassword(project.password)
    }
    init()
  }, [props.id, props.openEditDialog])

  return (
    <Dialog open={props.openEditDialog} onClose={props.closeEditDialogFunc}>
      <DialogTitle>Edit Project {project?._id}</DialogTitle>
      <DialogContent>
        <TextField
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          fullWidth
          placeholder='Title'
          style={{ marginTop: 20 }}
          label='Title'
        />
        <TextField
          value={description}
          onChange={e => setDescription(e.target.value)}
          autoFocus
          fullWidth
          placeholder='Description'
          style={{ marginTop: 20 }}
          label='Description'
        />
        <Grid display={'grid'} justifyItems={'center'} gap={5}>
          <input ref={inputRef} type='file' onChange={onImgChange} style={{ marginTop: 20 }} />
          {imageUrl ? (
            <Cropper
              style={{ height: 400, width: '100%' }}
              initialAspectRatio={1}
              preview='.img-preview'
              src={imageUrl}
              ref={cropperRef}
              viewMode={1}
              guides={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              checkOrientation={false}
            />
          ) : null}
          <Box display={'flex'} gap={5}>
            <Button variant='text' onClick={rotateAction}>
              Rotate
            </Button>
            <Button variant='outlined' onClick={cropAction}>
              Crop
            </Button>
          </Box>
        </Grid>
        <TextField
          value={githubUrl}
          onChange={e => setGithubUrl(e.target.value)}
          autoFocus
          fullWidth
          placeholder='GithubUrl'
          style={{ marginTop: 20 }}
          label='GithubUrl'
        />
        <TextField
          value={deployUrl}
          onChange={e => setDeployUrl(e.target.value)}
          autoFocus
          fullWidth
          placeholder='DeployUrl'
          style={{ marginTop: 20 }}
          label='DeployUrl'
        />
        <TextField
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          fullWidth
          placeholder='Email'
          style={{ marginTop: 20 }}
          label='Email'
        />
        <TextField
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          fullWidth
          placeholder='Password'
          style={{ marginTop: 20 }}
          label='Password'
        />
      </DialogContent>
      <DialogActions style={{ marginTop: 20 }}>
        <Button variant='outlined' onClick={() => resetAction()}>
          Restore
        </Button>
        <Button variant='contained' onClick={() => updateAction()}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
