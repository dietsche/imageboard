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
        fileSize: 5000000 //2 MB limit!
    }
});

const db = require("./utils/db");

app.use(express.static("./public"));
app.use(express.json());

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

app.post("/addTags", (req, res) => {
    console.log("das kommt beim Server nach add-Tags-req an: ", req.body);
    const { tags, image_id } = req.body;
    for (let i = 0; i < tags.length; i++) {
        db.addTags(tags[i], image_id)
            .then(({ rows }) => {
                console.log("Antwort von addTag-DB rows[0]: ", rows[0]);
                res.json();
            })
            .catch(err => {
                console.log("error in post: ", err);
            });
    }
});

app.get("/tags/:id", (req, res) => {
    db.getTags(req.params.id).then(result => {
        console.log("result TAGS: ", result.rows);
        res.json(result.rows);
    });
});

app.get("/image_ids-with-tag/:tag", (req, res) => {
    console.log("image_ids-with-tag runs");
    db.getImageIdsWithTag(req.params.tag).then(result => {
        console.log("result ImageIdsWithTAGS: ", result.rows);
        res.json(result.rows);
    });
});

app.get("/images", (req, res) => {
    db.getImages().then(result => {
        // console.log(result.rows);
        res.json(result.rows);
    });
});

app.get("/more-images/:startid/:offset", (req, res) => {
    db.getMoreImages(req.params.startid, req.params.offset).then(({ rows }) => {
        res.json(rows);
        console.log("new rows: ", rows);
    });
});

app.get("/current-image/:id", (req, res) => {
    console.log("req.params ", req.params.id);
    db.getCurrentImage(req.params.id)
        .then(result => {
            console.log("result.rows ", result.rows);
            res.json(result.rows);
        })
        .catch(err => {
            console.log("NO IMAGE: ", err);
        });
});

app.get("/comments/:id", (req, res) => {
    db.getComments(req.params.id).then(result => {
        console.log("result comments: ", result.rows);
        res.json(result.rows);
    });
});

app.post("/add-comment", (req, res) => {
    console.log("post comment req.body: ", req.body.comment);
    console.log("post comment req.body: ", req.newcomment);

    const { comment, username, image_id } = req.body;
    db.addComment(comment, username, image_id)
        //wie gehe ich mit return-werten um, damit aktualisierung sofort erfolgt????
        .then(({ rows }) =>
            res.json({
                comment: rows[0] //({ success: true });
            })
        )
        .catch(err => {
            console.log("error in post: ", err);
        });
});

app.listen(8080, () => {
    console.log("server running");
});
