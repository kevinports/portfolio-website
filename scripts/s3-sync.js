var AWS = require('aws-sdk');
var s3 = require('s3');
require('dotenv').config();
console.log('#########################')
console.log(process.env.AWS_KEY)
var client = s3.createClient({
  s3Client: new AWS.S3(),
  s3Options: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
  },
});

const params = {
  localDir: "./www/assets_rev/",
  deleteRemoved: true,
  s3Params: {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: "assets/"
  },
};

console.log('~~~~~~~~~~~~~~~~~')
console.log("BEGIN UPLOAD");
const uploader = client.uploadDir(params);

uploader.on('error', function(err) {
  console.error("unable to sync:", err.stack);
});

uploader.on('progress', function() {
  console.log("progress:", uploader.progressAmount, uploader.progressTotal);
});

uploader.on('end', function() {
  console.log("UPLOAD COMPLETE");
  console.log('~~~~~~~~~~~~~~~~~')
  process.exit(1);
});
