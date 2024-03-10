import React, { useState, FormEvent } from "react";
import { GoogleLogin } from "react-google-login";
import useLogin from "shared/hooks/useLogin";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const CLIENT_ID = "827529413912-celsdkun_YOUR_API_KEY_lsn28.apps.googleusercontent.com";

const texts = [
    "Welcome to BEAPEngine, a research project founded by Dr. Daniel Fuller.",
    "Help us in our mission to improve the lives of people with disabilities.",
    "Join our community of researchers and developers to make a difference.",
    "We are looking for volunteers to help us with our research project.",
    // Add more texts here...
];

function LoginPage() {
    const [userType, setUserType] = useState("researcher");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin } = useLogin();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSignUpClick = () => {
        navigate("/signup");
    };

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % texts.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((currentIndex - 1 + texts.length) % texts.length);
    };

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
        <div className={styles["login-page"]}>
            <div className={styles.container}>
                <div className={styles["left-section"]}>
                    <h1 className={styles["signin-text"]}>Sign In</h1>
                    <p className={styles["login-text"]}>
                        Log into your existing BEAPENGINE account
                    </p>
                    <GoogleLogin
                        clientId={CLIENT_ID}
                        buttonText="Login with Google"
                        onSuccess={responseGoogleSuccess}
                        onFailure={responseGoogleError}
                        isSignedIn
                        cookiePolicy="single_host_origin"
                        render={(renderProps) => (
                            <button
                                type="button"
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                className={styles["google-login"]}
                            >
                                Login with Google
                            </button>
                        )}
                    />
                    <p>OR</p>
                    <form onSubmit={handleSubmit} className={styles["form-box"]}>
                        <div className={styles.tabs}>
                            <button
                                type="button"
                                className={`${styles.tab} ${styles.researcher} ${userType === "researcher" ? styles.active : ""}`}
                                onClick={() => setUserType("researcher")}
                            >
                                Researcher
                            </button>
                            <button
                                type="button"
                                className={`${styles.tab} ${styles.personal} ${userType === "personal" ? styles.active : ""}`}
                                onClick={() => setUserType("personal")}
                            >
                                Personal User
                            </button>
                        </div>
                        <div className={styles["input-field"]}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={styles["input-field"]}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles["button-container"]}>
                            <p className={styles["forgot-password"]}>Forgot password?</p>
                            <button
                                type="submit"
                                className={`${styles.button} ${styles["sign-in"]}`}
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
                <div className={styles["right-section"]}>
                    <h1>
                        <span className={styles.beap}>BEAP</span>
                        <span className={styles.engine}>ENGINE</span>
                    </h1>
                    <p>JOIN OUR RESEARCH PROJECT</p>
                    <div className={styles["text-slider"]}>
                        <button type="button" onClick={handlePrevious}>
                            ←
                        </button>
                        <p>{texts[currentIndex]}</p>
                        <button type="button" onClick={handleNext}>
                            →
                        </button>
                    </div>
                    <div className={styles["cta-box"]}>
                        <div className={styles["text-container"]}>
                            <p className={`${styles["cta-text"]} ${styles["no-account"]}`}>
                                No account?
                            </p>
                            <p className={styles["cta-text"]}>Get started for free</p>
                        </div>
                        <button
                            type="button"
                            className={`${styles.button} ${styles["sign-up"]}`}
                            onClick={handleSignUpClick}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
