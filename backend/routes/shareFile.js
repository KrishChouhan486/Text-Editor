import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"), 
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

async function shareFile(fileId) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader", // Can be "writer" if edit access is needed
        type: "user",
        emailAddress: "your-email@gmail.com", // Change this to your email
      },
    });

    console.log(`✅ File shared with your email: your-email@gmail.com`);
  } catch (error) {
    console.error("❌ Error sharing file:", error);
  }
}

// Replace with your actual file ID
shareFile("1r8Tfp6Jp6D99fCv5XZ_qPdOq_RrlOkBv");
