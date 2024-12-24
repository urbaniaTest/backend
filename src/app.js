import express, { json } from "express";
import cors from "cors";
import authRoutes from "./routes/user.routes.js";
import obraRoutes from "./routes/obra.routes.js";
import { FRONTEND_URL } from "./config.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express(); // Aquí invocas la función

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL, // Añade aquí tu localhost o el dominio permitido
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes); // Asegúrate de usar json middleware para manejar JSON en las peticiones
app.use("/api/obra", obraRoutes);

export default app;
