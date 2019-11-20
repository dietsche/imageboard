var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db.query("SELECT * FROM images ORDER BY created_at DESC LIMIT 12");
};

exports.getCurrentImage = function(id) {
    return db.query("SELECT * FROM images WHERE id = $1", [id]);
};

exports.addImage = function(imageUrl, username, title, description) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [imageUrl, username, title, description]
    );
};

exports.getComments = function(image_id) {
    return db.query(
        "SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC",
        [image_id]
    );
};

exports.addComment = function(comment, user, image_id) {
    return db.query(
        "INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING *",
        [comment, user, image_id]
    );
};
