"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var pusher_exports = {};
__export(pusher_exports, {
  router: () => router
});
module.exports = __toCommonJS(pusher_exports);
var import_express = require("express");
const Client = require("@replit/database");
const router = (0, import_express.Router)();
const db = new Client();
router.post("/channel", (req, res) => {
  const data = JSON.parse(req.body);
  if (req.headers["X-Pusher-Key"] != process.env["PUSHER_KEY"]) {
    res.sendStatus(401);
    return;
  }
  const event = data.events[0];
  const channelID = event.channel;
  if (event.name == "channel_vacated") {
    db.deleteMultiple(channelID, `${channelID}:offer`);
  }
  res.sendStatus(200);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});
//# sourceMappingURL=pusher.js.map
