// const bodyParser = require("body-parser");
const { json } = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;
const prevId = 0;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idGen() {
  let id = 1;
  return function () {
    id = id + 1;
    return id;
  };
}
const newId = idGen();

// TODO: your code to handle requests
server.post("/posts", function (req, res) {
  const post = req.body;
  if (!post.title || !post.author || !post.contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
  post.id = prevId + 1;
  posts.push(post);
  return res.status(200).json(post);
});

server.post("/posts/author/:author", function (req, res) {
  const post = req.body; //{title, contents}
  const author = req.params.author;
  if (!post.title || !author || !post.contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
  post.author = author;
  post.id = prevId + 1;
  posts.push(post);
  return res.status(200).json(post);
});

server.get("/posts", function (req, res) {
  const { term } = req.query;
  if (term) {
    const postsTerm = posts.filter((post) => {
      return post.title.includes(term) || post.contents.includes(term);
    });
    return res.status(200).json(postsTerm);
  } else res.status(200).send(posts);
});

server.get("/posts/:author", (req, res) => {
  const author = req.params.author;

  const postsAuthor = posts.filter((p) => {
    return p.author === author;
  });
  if (postsAuthor.length > 0) {
    return res.status(200).json(postsAuthor);
  } else {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  }
});

server.get("/posts/:author/:title", (req, res) => {
  const author = req.params.author;
  const title = req.params.title;
  const postsAuthorId = posts.filter((p) => {
    return p.author === author && p.title === title;
  });
  if (postsAuthorId.length > 0) {
    return res.status(200).json(postsAuthorId);
  } else {
    res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  }
});

// server.put("/posts", function (req, res) {
//   const post = req.body;
//   if (!post.id || !post.title || !post.contents) {
//     return res.status(STATUS_USER_ERROR).json({
//       error:
//         "No se recibieron los parámetros necesarios para modificar el Post",
//     });
//   } else {
//     const postsIdIndex = posts.findIndex((p) => {
//       return p.id === post.id;
//     });
//     if (postsIdIndex === -1)
//       res.status(STATUS_USER_ERROR).json({
//         error: "El id no corresponde con un Post existente",
//       });
//     posts[postsIdIndex].title = post.title;
//     posts[postsIdIndex].contents = post.contents;
//     console.log("id: ", post.id, "posts: ", posts);
//     return res.status(200).json(post);
//   }
// });

module.exports = { posts, server };
