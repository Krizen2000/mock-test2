import { Button, Card, CardHeader, Grid, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { disableMock } from 'src/@fake-db/mock'
import 'cropperjs/dist/cropper.css'
import { Project, getProjects } from 'src/views/projects/helpers'
import ViewDialog from 'src/views/projects/viewDialog'
import CreateDialog from 'src/views/projects/createDialog'
import EditDialog from 'src/views/projects/editDialog'
import TableView from 'src/views/projects/tableView'
import GridView from 'src/views/projects/gridView'

const Projects: React.FC = () => {
  const [projects, setProjects] = useState(Array<Project>())

  const [projectsView, setProjectsView] = useState<'Table' | 'Grid'>('Table')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)

  const refreshProjects = () => getProjects().then(projects => (projects?.length ? setProjects(projects) : null))

  useEffect(() => {
    disableMock()
    const init = async () => {
      const projects = await getProjects()
      if (!projects) return
      setProjects(projects)
    }
    init()
  }, [])

  return (
    <Grid container spacing={10}>
      <Grid item xs={12}>
        <Box display={'flex'} ml={2} mr={12} justifyContent={'space-between'}>
          <Typography variant='h4' sx={{ mb: 2 }}>
            Projects:
          </Typography>
          <Button variant='contained' onClick={() => setOpenCreateDialog(true)}>
            Create
          </Button>
        </Box>
        <ViewDialog
          id={selectedId}
          openViewDialog={openViewDialog}
          closeViewDialogFunc={() => setOpenViewDialog(false)}
        />
        <CreateDialog
          openCreateDialog={openCreateDialog}
          closeCreateDialogFunc={() => setOpenCreateDialog(false)}
          refreshProjects={refreshProjects}
        />
        <EditDialog
          id={selectedId}
          openEditDialog={openEditDialog}
          closeEditDialogFunc={() => setOpenEditDialog(false)}
          refreshProjects={refreshProjects}
        />
      </Grid>
      <Grid item xs={12} display={'grid'} gap={5}>
        <Card>
          <CardHeader
            title='Projects'
            action={
              <Tooltip
                title={`Toggle to change the view from ${projectsView} to ${
                  projectsView === 'Table' ? 'Grid' : 'Table'
                }`}
              >
                <Button
                  variant='outlined'
                  onClick={() => setProjectsView(state => (state === 'Table' ? 'Grid' : 'Table'))}
                >{`${projectsView} view`}</Button>
              </Tooltip>
            }
          />
          {projectsView === 'Table' ? (
            <TableView
              projects={projects}
              setSelectedId={(state: string) => setSelectedId(state)}
              setOpenEditDialog={() => setOpenEditDialog(true)}
              setOpenViewDialog={() => setOpenViewDialog(true)}
              refreshProjects={refreshProjects}
            />
          ) : null}
        </Card>
        {projectsView === 'Grid' ? (
          <GridView
            projects={projects}
            setSelectedId={(state: string) => setSelectedId(state)}
            setOpenEditDialog={() => setOpenEditDialog(true)}
            setOpenViewDialog={() => setOpenViewDialog(true)}
            refreshProjects={refreshProjects}
          />
        ) : null}
      </Grid>
    </Grid>
  )
}

export default Projects
