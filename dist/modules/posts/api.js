"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsApi = void 0;
var express_1 = require("express");
var posts = [
    { id: 1, title: "Some title 1", body: "Some body" },
    { id: 2, title: "Some title 2", body: "Some body" },
    { id: 3, title: "Some title 3", body: "Some body" },
    { id: 4, title: "Some title 4", body: "Some body" },
];
var getPosts = function (_, res) {
    res.json(posts);
};
var getPost = function (req, res) {
    if (!req.params.id) {
        res.status(400).json({ message: "No id was provided" });
    }
    var id = parseInt(req.params.id);
    var post = posts.find(function (post) { return post.id === id; });
    if (post)
        res.json(post);
    else
        res.status(404).json({ message: "No post was found with such id." });
};
var postsApi = express_1.Router().get("/", getPosts).get("/:id", getPost);
exports.postsApi = postsApi;
