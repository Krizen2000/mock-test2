import {
  Button,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { Project, deleteProject } from './helpers'
import { MouseEvent, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  projects: Project[]
  setSelectedId: (state: string) => void
  setOpenEditDialog: () => void
  setOpenViewDialog: () => void
  refreshProjects: () => void
}

const TableView: React.FC<Props> = props => {
  const [anchorEl, setAnchorEl] = useState<{} | null>(null)

  const handleClick = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl({ [index]: event.currentTarget })
  }
  const handleClose = () => setAnchorEl(null)

  const handleOnView = (id: string) => {
    handleClose()
    props.setSelectedId(id)
    props.setOpenViewDialog()
  }
  const handleOnDelete = (id: string, title: string) => {
    handleClose()
    const condition = confirm(`Do you want to delete (${title})?`)
    if (!condition) return
    deleteProject(id).then(props.refreshProjects)
  }
  const handleOnEdit = (id: string) => {
    handleClose()
    props.setSelectedId(id)
    props.setOpenEditDialog()
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              Title
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              Description
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              ImageUrl
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              GithubLink
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              DeployLink
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              Email
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              Password
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} align='center'>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.projects.map((project, inx) => (
            <TableRow key={project._id} hover role='checkbox'>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell align='center'>
                <Image
                  src={project.imageUrl.length > 50 ? project.imageUrl : ''}
                  height={100}
                  width={200}
                  style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                  alt={`${project.title} image`}
                />
              </TableCell>
              <TableCell>
                <Link style={{ color: 'inherit' }} href={`http://${project.githubUrl}`}>
                  {project.githubUrl}
                </Link>
              </TableCell>
              <TableCell>
                <Link style={{ color: 'inherit' }} href={`http://${project.deployUrl}`}>
                  {project.deployUrl}
                </Link>
              </TableCell>
              <TableCell>{project.email}</TableCell>
              <TableCell>{project.password}</TableCell>
              <TableCell align='center'>
                <Button variant='outlined' onClick={e => handleClick(inx, e)}>
                  Actions
                </Button>
                <Menu
                  id={project._id}
                  keepMounted
                  // eslint-disable-next-line lines-around-comment
                  // @ts-ignore For now
                  anchorEl={anchorEl && anchorEl[inx]}
                  onClose={() => handleClose()}
                  // eslint-disable-next-line lines-around-comment
                  // @ts-ignore For now
                  open={anchorEl && anchorEl[inx]}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <MenuItem onClick={() => handleOnView(project._id)}>View</MenuItem>
                  <MenuItem onClick={() => handleOnEdit(project._id)}>Edit</MenuItem>
                  <MenuItem onClick={() => handleOnDelete(project._id, project.title)}>Delete</MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableView
