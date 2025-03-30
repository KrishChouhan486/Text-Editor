const GoogleAuthButton = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  console.log("✅ Google Auth Button Rendered"); // Log when button is loaded

  return (
    <a
      href={`${backendUrl}/auth/google`}
      onClick={() => console.log("🔵 Google OAuth Button Clicked")}
    >
      <button>Sign in with Google</button>
    </a>
  );
};
