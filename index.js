const express = require("express");
const bodyParser = require("body-parser");
const jsonfile = require("jsonfile");
const db = require("./db/db.json");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/posts", (req, res) => {
    res.json(db);
});

app.get("/posts/:id", (req, res) => {
    let id = req.params.id;
    let post = db.find((post) => post.id == id);
    if (!post) {
        res.json({ message: "Not Found Any Post Related to Your ID" });
    } else {
        res.json(post);
    }
});

app.get("/posts-author/:author", (req, res) => {
    let author = req.params.author;
    let posts = db.filter((post) => post.author == author);
    if (posts.length === 0) {
        res.json({ message: `No Posts Found Against This Author ${author}` });
    } else {
        res.json(posts);
    }
});

app.get("/postform", (req, res) => {
    res.sendFile("views/postform.html", { root: __dirname });
});

app.get("/updateform", (req, res) => {
    res.sendFile("views/postupdate.html", { root: __dirname });
});

app.post("/newpost", (req, res) => {
    const newPost = {
        id: db.length + 1,
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        tags: req.body.tags.split(","),
        author: req.body.author // Assuming author is part of the request body
    };

    db.push(newPost);
    jsonfile.writeFile("./db/db.json", db, (err) => {
        if (err) {
            console.error(err);
            res.json({ message: "Error writing to database" });
        } else {
            res.json({
                message: `Post added successfully! Your Post Id is ${newPost.id}`
            });
        }
    });
});

app.post("/updatepost", (req, res) => {
    let id = req.body.id;
    let post = db.find((post) => post.id == id);
    if (!post) {
        res.status(404).json({ message: "Not Found Any Post Related to Your ID" });
    } else {
        post.title = req.body.title;
        post.content = req.body.content;
        post.category = req.body.category;
        post.tags = req.body.tags.split(",");
        jsonfile.writeFile("./db/db.json", db, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error writing to database" });
            } else {
                res.json({
                    message: `Post updated successfully! Your Post Id is ${id}`,
                });
            }
        });
    }
});

app.get("/deletepost/:id", (req, res) => {
    let id = req.params.id;
    let postIndex = db.findIndex((post) => post.id == id);
    if (postIndex === -1) {
        res.status(404).json({ message: "Not Found Any Post Related to Your ID" });
    } else {
        db.splice(postIndex, 1);
        jsonfile.writeFile("./db/db.json", db, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error writing to database" });
            } else {
                res.json({
                    message: `Post deleted successfully! Your Post Id was ${id}`,
                });
            }
        });
    }
});

app.listen(port, () => {
    console.log(`${port} is running...`);
});
