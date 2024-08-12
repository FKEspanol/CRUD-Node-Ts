import express from "express";
import cors from "cors";

import route from "./routes/router";

const PORT: string | number = process.env.PORT as string | 2000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", route);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
