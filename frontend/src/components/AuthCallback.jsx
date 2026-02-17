import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthCallback({ onLoginSuccess }) {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/me/", { withCredentials: true });
        if (res.data?.authenticated) onLoginSuccess(res.data);
        navigate("/");
      } catch (e) {
        navigate("/");
      }
    })();
  }, []);

  return <div>Signing you in...</div>;
}
