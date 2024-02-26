import React, { useState, FormEvent } from "react";
import { GoogleLogin } from "react-google-login";
import "./LoginPage.css"; // Import your CSS file
import useLogin from "../../../shared/hooks/useLogin"; // Import the useLogin hook

const CLIENT_ID =
  "827529413912-celsdkun_YOUR_API_KEY_lsn28.apps.googleusercontent.com";

function LoginPage() {
  const [userType, setUserType] = useState("researcher");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useLogin();

  // Success Handler
  const responseGoogleSuccess = (response: any) => {
    const userInfo = {
      name: response.profileObj.name,
      emailId: response.profileObj.email,
    };
    console.log(userInfo);
  };

  // Error Handler
  const responseGoogleError = (response: any) => {
    console.error(response);
  };

  // Add this function
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await handleLogin(username, password);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="left-section">
          <h1 className="sign-in-text">Sign In</h1>
          <p className="login-text">Log into your existing BEAPENGINE account.</p>
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleError}
            isSignedIn={true}
            cookiePolicy="single_host_origin"
            render={renderProps => (
              <button type="button" onClick={renderProps.onClick} disabled={renderProps.disabled} className="google-login">
                Login with Google
              </button>
            )}
          />
          <p>OR</p>
          <form onSubmit={handleSubmit} className="form-box">
            <div className="tabs">
              <button
                type="button"
                className={`tab researcher ${userType === "researcher" ? "active" : ""}`}
                onClick={() => setUserType("researcher")}
              >
                Researcher
              </button>
              <button
                type="button"
                className={`tab personal ${userType === "personal" ? "active" : ""}`}
                onClick={() => setUserType("personal")}
              >
                Personal User
              </button>
            </div>
            <div className="input-field username-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-field password-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="button-container">
              <p className="forgot-password">Forgot password?</p>
              <button type="submit" className="sign-in">
                Sign In
              </button>
            </div>
          </form>
        </div>
        <div className="right-section">
          <h1>
            BEAP<span>ENGINE</span>
          </h1>
          <div className="text-slider">
            <p>JOIN OUR RESEARCH PROJECT</p>
            {/* Add your other words here */}
          </div>
          <div className="cta-box">
            <p>No account? Get started for free</p>
            <button type="button" className="sign-up">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
