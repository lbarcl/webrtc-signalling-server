import { Router } from "express";
const Client = require("@replit/database");

export const router = Router();
const db = new Client();


router.post('/channel', (req, res) => {
  const data = JSON.parse(req.body);
  if (req.headers['X-Pusher-Key'] != process.env['PUSHER_KEY']) {
    res.sendStatus(401);
    return;
  }

  const event = data.events[0]
  const channelID = event.channel;
  if (event.name == "channel_vacated") {
    db.deleteMultiple(channelID, `${channelID}:offer`)
  }

  res.sendStatus(200);
})