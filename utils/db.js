var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db.query("SELECT * FROM images ORDER BY id DESC LIMIT 9");
};

exports.getMoreImages = function(startId, offset) {
    return db.query(
        `SELECT * FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT $2`,
        [startId, offset]
    );
};

exports.getCurrentImage = function(id) {
    return db.query(
        `SELECT *, (SELECT MIN(id) FROM images
        WHERE id > $1) AS nextid, (SELECT MAX(id) FROM images
        WHERE id < $1) AS previd FROM images WHERE id = $1`,
        [id]
    );
};

exports.addImage = function(imageUrl, username, title, description) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [imageUrl, username, title, description]
    );
};

exports.addTags = function(tag, image_id) {
    return db.query(
        "INSERT INTO tags (tag, image_id) VALUES ($1, $2) RETURNING *",
        [tag, image_id]
    );
};

exports.getTags = function(image_id) {
    return db.query("SELECT tag FROM tags WHERE image_id = $1", [image_id]);
};

exports.getImageIdsWithTag = function(tag) {
    return db.query(
        "SELECT * FROM tags LEFT JOIN images ON tags.image_id = images.id WHERE tag = $1 ",
        [tag]
    );
};

exports.getComments = function(image_id) {
    return db.query(
        "SELECT TO_CHAR(created_at, 'MM/DD/YYYY, HH12:MIPM') created_at, username, comment FROM comments WHERE image_id = $1 ORDER BY id DESC",
        [image_id]
    );
};

exports.addComment = function(comment, user, image_id) {
    return db.query(
        "INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING id, comment, username, image_id, TO_CHAR(created_at, 'MM/DD/YYYY, HH12:MIPM') created_at",
        [comment, user, image_id]
    );
};
