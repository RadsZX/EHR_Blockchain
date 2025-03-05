require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");

// ✅ Ensure uploadToStorj is correctly imported
const { uploadToStorj } = require("./storj");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file received!");
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    console.log("✅ File received:", req.file.originalname);

    // ✅ Debugging: Check if uploadToStorj function is available
    if (typeof uploadToStorj !== "function") {
      throw new Error("uploadToStorj is not a function. Check your storj.js export.");
    }

    // ✅ Upload to Storj
    const imageUrl = await uploadToStorj(req.file);
    console.log("✅ File uploaded successfully:", imageUrl);

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    res.status(500).json({ success: false, error: error.message || "Image upload failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
