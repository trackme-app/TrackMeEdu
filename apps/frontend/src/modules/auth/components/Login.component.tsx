import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../common/services/auth/AuthProvider";
import { useTheme } from "../../common/design-system/ThemeContext";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  // Handle input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Check if all fields are filled
    const allFieldsFilled = Object.values(updatedFormData).every(
      (field) => field.trim() !== ""
    );
    setIsButtonDisabled(!allFieldsFilled);
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // demo: accept any non-empty username
      if (!formData.username) {
        setError("Please enter a username");
        return;
      }
      await auth.login(formData.username, formData.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };


  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerStyle: React.CSSProperties = {
    padding: 24,
    maxWidth: 420,
    margin: "40px auto",
    //background: isDark ? process.env.REACT_APP_DM_ALT_BACKGROUND : process.env.REACT_APP_LM_ALT_BACKGROUND,
    color: isDark ? "#e6eef8" : "#0b1220",
    borderRadius: 8,
    boxShadow: isDark ? "0 6px 20px rgba(2,6,23,0.6)" : "0 6px 20px rgba(2,6,23,0.08)",
  };

  const inputStyle: React.CSSProperties = {
    width: "90%",
    padding: "10px 12px",
    borderRadius: 6,
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(2,6,23,0.08)",
    background: isDark ? "#0b1220" : "#fff",
    color: isDark ? "#e6eef8" : "#0b1220",
    boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.02)" : "none",
    fontSize: 14,
  };

  const buttonStyle: React.CSSProperties = {
    width: "60%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    //background: isDark ? process.env.REACT_APP_DM_MAIN_BUTTON_POS : process.env.REACT_APP_LM_MAIN_BUTTON_POS,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  };

  return (
    <div style={{ paddingTop: 40, paddingBottom: 80, minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={containerStyle}>
        <h2 style={{ marginTop: 0 }}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Username</label>
            <input name="username" value={formData.username} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleInputChange} style={inputStyle} />
          </div>
          {error && <div style={{ color: "#ff6b6b", marginBottom: 8 }}>{error}</div>}
          <button type="submit" style={buttonStyle} disabled={isButtonDisabled}>Sign in</button>
        </form>
      </div>
    </div>
  );
};
