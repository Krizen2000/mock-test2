import { Project, deleteProject } from './helpers'
import { MouseEvent, useState } from 'react'
import { Box } from '@mui/system'
import ProjectCard from './projectCard'

type Props = {
  projects: Project[]
  setSelectedId: (state: string) => void
  setOpenEditDialog: () => void
  setOpenViewDialog: () => void
  refreshProjects: () => void
}

const GridView: React.FC<Props> = props => {
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
    <Box display={'flex'} flexWrap={'wrap'} justifyContent={'start'} gap={6}>
      {props.projects.map((project, inx) => (
        <ProjectCard
          key={project._id}
          title={project.title}
          description={project.description}
          imageUrl={project.imageUrl}
          githubUrl={project.githubUrl}
          deployUrl={project.deployUrl}
          email={project.email}
          password={project.password}
          // eslint-disable-next-line lines-around-comment
          // @ts-ignore For now
          anchorEl={anchorEl && anchorEl[inx]}
          handleClick={(e: MouseEvent<HTMLButtonElement>) => handleClick(inx, e)}
          handleClose={handleClose}
          viewAction={() => handleOnView(project._id)}
          deleteAction={() => handleOnDelete(project._id, project.title)}
          editAction={() => handleOnEdit(project._id)}
        />
      ))}
    </Box>
  )
}

export default GridView
