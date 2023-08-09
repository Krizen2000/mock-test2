import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography
} from '@mui/material'
import { Project } from './helpers'
import { MouseEvent, useState } from 'react'
import Image from 'next/image'
import { ExpandLess, ExpandMore, MoreVert } from '@mui/icons-material'
import Link from 'next/link'

type Props = {
  anchorEl: {} | null
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void
  handleClose: () => void
  viewAction: () => void
  deleteAction: () => void
  editAction: () => void
} & Omit<Project, '_id'>

const ProjectCard: React.FC<Props> = props => {
  const [expanded, setExpanded] = useState(false)

  const toggleVisibilty = () => setExpanded(state => !state)

  return (
    <Card
      component={Paper}
      elevation={6}
      sx={{
        maxWidth: 345,
        borderRadius: '0.25rem',
        transition: '250ms transform',
        ':hover': { boxShadow: 20, transform: 'scale(1.05)' }
      }}
    >
      <CardHeader
        title={`Title: ${props.title}`}
        action={
          <>
            <Menu
              keepMounted
              // eslint-disable-next-line lines-around-comment
              // @ts-ignore For now
              anchorEl={props.anchorEl}
              onClose={props.handleClose}
              // eslint-disable-next-line lines-around-comment
              // @ts-ignore For now
              open={props.anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuItem onClick={props.viewAction}>View</MenuItem>
              <MenuItem onClick={props.editAction}>Edit</MenuItem>
              <MenuItem onClick={props.deleteAction}>Delete</MenuItem>
            </Menu>
            <IconButton onClick={props.handleClick}>
              <MoreVert />
            </IconButton>
          </>
        }
      />
      {props.imageUrl.length > 50 ? (
        <Image
          src={props.imageUrl}
          height={0}
          width={0}
          alt={`${props.title} image`}
          style={{ height: 100, width: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Typography textAlign={'center'}>Image: {props.imageUrl}</Typography>
      )}
      <CardContent>
        <Typography>
          Project Link:{' '}
          <Link style={{ color: 'inherit' }} href={`http://${props.githubUrl}`}>
            {props.githubUrl}
          </Link>
        </Typography>
        <Typography>
          Deployed Link:{' '}
          <Link style={{ color: 'inherit' }} href={`http://${props.deployUrl}`}>
            {props.deployUrl}
          </Link>
        </Typography>
        <Typography>Email used: {props.email}</Typography>
        <Typography>Password: {props.password}</Typography>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton onClick={toggleVisibilty}>{!expanded ? <ExpandMore /> : <ExpandLess />}</IconButton>
      </CardActions>
      <Collapse in={expanded} timeout={'auto'} unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>{props.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default ProjectCard
