const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables (>> heroku)
} else {
    secrets = require("./secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.awsKey,
    secretAccessKey: secrets.awsSecret
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        console.log("no req.file");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    s3.putObject({
        Bucket: "imageboard-dietsche",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
        .promise()
        .then(() => {
            next();
        })
        .catch(err => {
            console.log(err); //404 > bucket-name wrong...
            res.sendStatus(500);
        });
};
