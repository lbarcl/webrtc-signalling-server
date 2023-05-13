"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_cominication = require("./Routes/cominication");
var import_pusher = require("./Routes/pusher");
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));
const PORT = 9090;
const app = (0, import_express.default)();
app.use(import_body_parser.default.text());
app.use((0, import_cors.default)());
app.use("/rooms", import_cominication.router);
app.use("/pusher", import_pusher.router);
app.listen(PORT);
//# sourceMappingURL=index.js.map
