import {
  createProject,
  deleteProject,
  getAllProjects,
  searchProject,
  updateProject,
} from "@controllers/projectController";
import { Router } from "express";
import tokenAuthorizer from "../middleware/tokenMiddleware";

const projectRouter = Router();

projectRouter.get("/search", tokenAuthorizer, searchProject);
projectRouter.get("/all", tokenAuthorizer, getAllProjects);
projectRouter.post("/", tokenAuthorizer, createProject);
projectRouter.put("/:projectId", tokenAuthorizer, updateProject);
projectRouter.delete("/:projectId", tokenAuthorizer, deleteProject);

export default projectRouter;
