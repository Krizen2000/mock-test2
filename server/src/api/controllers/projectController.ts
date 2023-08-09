import ProjectSchema from "@models/Project";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

type Project = {
  _id: ObjectId;
  client: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  deployUrl: string;
  email: string;
  password: string;
};

async function searchProject(req: Request, res: Response) {
  const ProjectModel = new ProjectSchema();
  const projectId = new ObjectId(req.query.projectId as string);
  let project: Project | null;
  try {
    project = await ProjectModel.findOne({ _id: projectId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  if (!project) {
    console.log("Project: ", project);
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.status(200).json(project);
}

async function getAllProjects(
  req: Request & { user: { userId: string } },
  res: Response
) {
  const ProjectModel = new ProjectSchema();
  const client = new ObjectId(req.user.userId);
  let projects: Project[] | null;
  try {
    projects = await ProjectModel.find({ client });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  if (!projects) {
    res.status(404).json({ message: "Projects not found" });
    return;
  }
  res.status(200).json({ projects });
}

async function createProject(
  req: Request & { user: { userId: string } },
  res: Response
) {
  const ProjectModel = new ProjectSchema();
  const client = new ObjectId(req.user.userId);
  let project: Project | null;

  try {
    project = await ProjectModel.createOne({ ...req.body, client });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  if (!project) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  res.status(201).json(project);
}

async function updateProject(req: Request, res: Response) {
  const ProjectModel = new ProjectSchema();
  let result = false;
  const projectId = new ObjectId(req.params.projectId);

  try {
    result = await ProjectModel.findOneAndUpdate({ _id: projectId }, req.body);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  if (!result) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  res.status(200).send();
}

async function deleteProject(req: Request, res: Response) {
  const ProjectModel = new ProjectSchema();
  let result = false;
  const projectId = new ObjectId(req.params.projectId);

  try {
    result = await ProjectModel.findOneAndDelete({ _id: projectId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  if (!result) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  res.status(200).send();
}

export {
  searchProject,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
};
