import express from "express";
import { router as rooms } from "./Routes/cominication";
import {router as pusher} from "./Routes/pusher";
import bodyParser from "body-parser";
import cors from "cors";
const PORT = 9090;
const app = express();

app.use(bodyParser.text());
app.use(cors())
app.use("/rooms", rooms);
app.use("/pusher", pusher);
app.listen(PORT);