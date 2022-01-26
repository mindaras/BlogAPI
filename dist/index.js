"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var api_1 = require("./modules/posts/api");
dotenv_1.default.config();
var init = function () {
    var app = express_1.default();
    app.use(cors_1.default());
    app.use(express_1.default.json());
    app.use("/posts", api_1.postsApi);
    app.listen(process.env.PORT, function () {
        return console.log("Listening on port: " + process.env.PORT);
    });
};
init();
