import express from "express";
import { google } from "googleapis";
import path from "path";
import { Readable } from "stream";

const router = express.Router();

// Google Authentication
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"), // Ensure this file exists
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// Upload Endpoint
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "No text provided" });

    const fileName = `Draft_${Date.now()}.txt`;  // Corrected string template
    const fileStream = Readable.from([text]); // Convert text to stream

    // Upload File to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: "text/plain",
      },
      media: {
        mimeType: "text/plain",
        body: fileStream,
      },
      fields: "id",
    });
    console.log("Upload Response:", response.data);

    // Return successful response with file ID and file link
    res.json({
      message: "File uploaded successfully",
      fileId: response.data.id,  // Ensure 'fileId' is included
      link: `https://drive.google.com/file/d/${response.data.id}/view`, // Corrected string template
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Upload failed", error: error.message }); // Enhanced error handling
  }
});

export default router;
