import express from "express";
import cors from "cors";
import authRouter from "@routes/authRouter";
import projectRouter from "@routes/projectRoutes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.use("/api", authRouter);
app.use("/api/projects", projectRouter);

export default app;
