import { Router } from "express";
import Pusher from "pusher";
const Client = require("@replit/database");
import { randomIDGen } from "../utils";

export const router = Router();
const pusher = new Pusher({
  //@ts-ignore
  appId: process.env['PUSHER_ID'],
  //@ts-ignore
  key: process.env['PUSHER_KEY'],
  //@ts-ignore
  secret: process.env['PUSHER_SECRET'],
  cluster: "eu",
  useTLS: true
})
const db = new Client();

router.post('/create', async (req, res) => {
  var id = randomIDGen(4);
  var isNotAvailable = await db.get(id);

  while (isNotAvailable == true) {
    id = randomIDGen(4);
    isNotAvailable = await db.get(id);
  }

  db.set(id, true);
  res.status(201);
  res.send(id);
})

router.post('/:id/offer', async (req, res) => {
  const id = req.params.id;
  const sdp = req.body;

  try {
    db.set(`${id}:offer`, sdp);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

router.get('/:id/offer', async (req, res) => {
  const id = req.params.id;

  try {
    const offer = await db.get(`${id}:offer`);
    res.send(offer);
    db.delete(`${id}:offer`);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

router.post('/:id/answer', async (req, res) => {
  const id = req.params.id;
  const sdp = req.body;

  try {
    db.set(`${id}:answer`, sdp);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

router.get('/:id/answer', async (req, res) => {
  const id = req.params.id;

  try {
    let offer = await db.get(`${id}:answer`);

    while (typeof offer != "string") {
      offer = await db.get(`${id}:answer`);
    }

    res.send(offer);
    db.delete(`${id}:answer`);
    db.set(`${id}:ice`, true);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

router.post('/:id/ice', async (req, res) => {
  const id = req.params.id;
  const socket_id = req.query.socketID?.toString();
  const sdp = req.body;

  if (socket_id == undefined) {
    res.sendStatus(400);
    return;
  }

  let ice = await db.get(`${id}:ice`);
  while (ice == null) {
    ice = await db.get(`${id}:ice`);
  }

  try {
    await pusher.trigger(`cache-${id}`, "ice", sdp, { socket_id });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.deleteMultiple(id, `${id}:offer`, `${id}:answer`)
  res.sendStatus(200);
})