const express = require("express");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 //2 MB limit!
    }
});

const db = require("./utils/db");

app.use(express.static("./public"));

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("this is the upload route");
    console.log("input: ", req.body);
    console.log("req.file: ", req.file);
    console.log("req.file.filename: ", req.file.filename);
    const { title, description, username } = req.body;
    const imageUrl = `${s3Url}/${req.file.filename}`;
    console.log(" imageUrl: ", imageUrl);
    db.addImage(imageUrl, username, title, description)
        .then(({ rows }) =>
            res.json({
                image: rows[0] //({ success: true });
            })
        )
        .catch(err => {
            console.log("error in post: ", err);
        });
});

app.get("/images", (req, res) => {
    db.getImages().then(result => {
        // console.log(result.rows);
        res.json(result.rows);
    });
});

app.listen(8080, () => {
    console.log("server running");
});
