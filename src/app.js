import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173"],
    allowedHeaders:["Content-Type","Authorization","Set-Cookie"],
    credentials:true,
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
}))

//import routes
import healthCheckRoutes from "./routes/healthcheck.routes.js"
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js"
import notesRoute from "./routes/notes.routes.js";
import projectmem from "./routes/projectmember.routes.js";
import taskRoute from "./routes/task.routes.js";
import subtaskRoutes from "./routes/subtask.routes.js";

app.use("/api/v1/healthcheck",healthCheckRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/project",projectRoutes)
app.use("/api/v1/notes",notesRoute)
app.use("/api/v1/projectmember",projectmem)
app.use("/api/v1/tasks",taskRoute)
app.use("/api/v1/subtasks",subtaskRoutes)

export default app;