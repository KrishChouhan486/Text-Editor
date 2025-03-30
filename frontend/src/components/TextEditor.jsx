import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill CSS
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const TextEditor = () => {
  const [text, setText] = useState("");  // State for the text in the editor
  const [drafts, setDrafts] = useState([]); // State to store drafts
  const navigate = useNavigate(); // React Router's navigate function

  // Load saved drafts from localStorage on mount
  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("drafts")) || [];
    setDrafts(savedDrafts);
  }, []);

  // Save the current draft
  const handleSaveDraft = () => {
    if (text.trim() === "") return;
    const newDrafts = [...drafts, text];
    setDrafts(newDrafts);
    localStorage.setItem("drafts", JSON.stringify(newDrafts));  // Save drafts to localStorage
    setText(""); // Clear the editor
  };

  // Delete a draft
  const handleDeleteDraft = (index) => {
    const newDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(newDrafts);
    localStorage.setItem("drafts", JSON.stringify(newDrafts));  // Update localStorage
  };

  // Upload a draft to the backend
  const handleUpload = async (draft) => {
    try {
      alert("Uploading... Please wait.");
      const response = await axios.post("http://localhost:3000/upload", { text: draft });

      if (response.data && response.data.link) {
        alert("✅ File uploaded successfully!\nView here: " + response.data.link);
      } else {
        alert("⚠️ Upload response missing expected fields.");
      }
    } catch (error) {
      console.error("❌ Upload failed", error);
      alert("Upload failed. Try again.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("drafts"); // Clear drafts from localStorage
    setDrafts([]); // Reset drafts in state

    // Send logout request to the server
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/logout`, { withCredentials: true })
      .then(() => {
        navigate("/");  // Redirect to login screen after successful logout
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-red-700 transition"
      >
        Logout
      </button>

      <div className="flex gap-6 w-full max-w-6xl mt-10">
        {/* Editor Section */}
        <div className="w-2/3 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-3xl font-bold mb-4 text-center">📝 Rich Text Editor</h2>
          <ReactQuill 
            theme="snow"
            value={text}
            onChange={setText}  // Update state on editor text change
            className="bg-white rounded-lg text-black"
            placeholder="Write something awesome..."
          />
          <button
            onClick={handleSaveDraft} 
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Save Draft
          </button>
        </div>

        {/* Drafts Section */}
        <div className="w-1/3 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">📜 Drafts</h2>
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {drafts.length === 0 ? (
              <p className="text-gray-400 text-center">No drafts saved.</p>
            ) : (
              <ul>
                {drafts.map((draft, index) => (
                  <li key={index} className="p-3 border border-gray-700 rounded-lg mb-3 flex justify-between items-center bg-gray-700">
                    <span className="truncate w-2/3 text-sm" dangerouslySetInnerHTML={{ __html: draft }}></span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpload(draft)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
