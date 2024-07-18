import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      console.log("Making API request to forgot-password endpoint"); // Log before the request
      await axios.post(
        "http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/auth/forgot-password",
        { email }
      );
      console.log("API request completed"); // Log after the request
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error("API request failed", error); // Log errors
      setError("Failed to send reset password email. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
