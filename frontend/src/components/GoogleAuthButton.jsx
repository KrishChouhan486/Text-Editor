import React from "react";

const GoogleAuthButton = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <a href={`${backendUrl}/auth/google`}>
      <button>Sign in with Google</button>
    </a>
  );
};

export default GoogleAuthButton;
