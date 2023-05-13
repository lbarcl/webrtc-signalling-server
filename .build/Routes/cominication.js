"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cominication_exports = {};
__export(cominication_exports, {
  router: () => router
});
module.exports = __toCommonJS(cominication_exports);
var import_express = require("express");
var import_pusher = __toESM(require("pusher"));
var import_utils = require("../utils");
const Client = require("@replit/database");
const router = (0, import_express.Router)();
const pusher = new import_pusher.default({
  appId: process.env["PUSHER_ID"],
  key: process.env["PUSHER_KEY"],
  secret: process.env["PUSHER_SECRET"],
  cluster: "eu",
  useTLS: true
});
const db = new Client();
router.post("/create", async (req, res) => {
  var id = (0, import_utils.randomIDGen)(4);
  var isNotAvailable = await db.get(id);
  while (isNotAvailable == true) {
    id = (0, import_utils.randomIDGen)(4);
    isNotAvailable = await db.get(id);
  }
  db.set(id, true);
  res.status(201);
  res.send(id);
});
router.post("/:id/offer", async (req, res) => {
  const id = req.params.id;
  const sdp = req.body;
  try {
    db.set(`${id}:offer`, sdp);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
router.get("/:id/offer", async (req, res) => {
  const id = req.params.id;
  try {
    const offer = await db.get(`${id}:offer`);
    res.send(offer);
    db.delete(`${id}:offer`);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
router.post("/:id/answer", async (req, res) => {
  const id = req.params.id;
  const sdp = req.body;
  try {
    db.set(`${id}:answer`, sdp);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
router.get("/:id/answer", async (req, res) => {
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
});
router.post("/:id/ice", async (req, res) => {
  var _a;
  const id = req.params.id;
  const socket_id = (_a = req.query.socketID) == null ? void 0 : _a.toString();
  const sdp = req.body;
  if (socket_id == void 0) {
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
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.deleteMultiple(id, `${id}:offer`, `${id}:answer`);
  res.sendStatus(200);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});
//# sourceMappingURL=cominication.js.map
