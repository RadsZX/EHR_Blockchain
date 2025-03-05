const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
});

async function uploadToStorj(file) {
  try {
    console.log("🔄 Uploading file to Storj:", file.originalname);

    const params = {
      Bucket: process.env.STORJ_BUCKET,
      Key: `uploads/${file.originalname}`, // Store all images inside "uploads/" folder
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    console.log("✅ File successfully uploaded!");

    // ✅ Generate the correct public share link using the folder-level Share ID
    const sharedUrl = `https://link.storjshare.io/s/${process.env.STORJ_SHARE_ID}/${process.env.STORJ_BUCKET}/uploads/${file.originalname}`;

    console.log("🔗 Storj Public Shared URL:", sharedUrl);
    return sharedUrl;
  } catch (error) {
    console.error("❌ Storj Upload Error:", error.message);
    throw error;
  }
}

module.exports = { uploadToStorj };
