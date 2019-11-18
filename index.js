const express = require("express");
const app = express();
const db = require("./utils/db");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages().then(result => {
        console.log(result.rows);
        res.json(result.rows);
    });
});

app.listen(8080, () => {
    console.log("server running");
});
