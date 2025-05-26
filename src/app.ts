import express from "express";
import routes from "./route";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

export default app;
