import { google } from "googleapis";
import path from "path";

// Authenticate
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"), 
  scopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
});

const drive = google.drive({ version: "v3", auth });

async function listFiles() {
  const response = await drive.files.list({
    pageSize: 10,
    fields: "files(id, name, parents)",
  });

  console.log("Uploaded Files:");
  response.data.files.forEach((file) => {
    console.log(`📂 Name: ${file.name}, 🆔 ID: ${file.id}, 📁 Folder ID: ${file.parents?.[0] || "Root"}`);
  });
}

listFiles();
