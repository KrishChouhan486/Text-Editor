import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Read from .env

export const logout = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logout`, { withCredentials: true });
    console.log("Logged out successfully", response);
    return response.data; // Return response if needed
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
