import React, { useState, FormEvent } from "react";
import useLogin from "shared/hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useRollbar } from "@rollbar/react";
import styles from "./LoginPage.module.css";
import leftArrow from "../../assets/left-arrow.png";
import rightArrow from "../../assets/right-arrow.png";
import ErrorSnackbar from "components/ErrorSnackbar/ErrorSnackbar";

const texts = [
    "Welcome to BEAPEngine, a research project founded by Dr. Daniel Fuller.",
    "Help us in our mission to improve the lives of people with disabilities.",
    "Join our community of researchers and developers to make a difference.",
    "We are looking for volunteers to help us with our research project.",
    // Add more texts here...
];

function LoginPage() {
    const rollbar = useRollbar();
    rollbar.debug("Reached Login page");

    const [userType, setUserType] = useState("researcher");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin, error: loginError } = useLogin();

    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);

    /**
     * Handles the sign-up click event.
     * Navigates to the sign-up page.
     */
    const handleSignUpClick = () => {
        navigate("/signup");
    };

    /**
     * Handles the click event to navigate to the next text.
     * Ensures that the texts array is not empty.
     * @pre texts array must not be empty
     * @post Advances currentIndex to the next index in the texts array.
     */
    const handleNext = () => {
        // Ensure texts array is not empty
        console.assert(texts.length > 0, "texts array should not be empty");
        if (!(texts.length > 0)) {
            rollbar.error("Assertion failed: text display array is empty");
        }
        setCurrentIndex((currentIndex + 1) % texts.length);
    };

    /**
     * Handles the click event to navigate to the previous text.
     * Ensures that the texts array is not empty.
     * @pre texts array must not be empty
     * @post Decreases currentIndex to the previous index in the texts array.
     */
    const handlePrevious = () => {
        // Ensure texts array is not empty
        console.assert(texts.length > 0, "texts array should not be empty");
        if (!(texts.length > 0)) {
            rollbar.error("Assertion failed: text display array is empty");
        }
        setCurrentIndex((currentIndex - 1 + texts.length) % texts.length);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        console.assert(
            typeof username === "string" && username !== "",
            "username should be a non-null string",
        );
        console.assert(
            typeof password === "string" && password !== "",
            "password should be a non-null string",
        );
        // Log to Rollbar if the assertion fails
        if (typeof username !== "string" || username === "") {
            rollbar.error("Assertion failed: username should be a non-null string");
        }
        if (typeof password !== "string" || password === "") {
            rollbar.error("Assertion failed: password should be a non-null string");
        }

        await handleLogin(username, password);
        navigate("/FileUploadPage");
    };

    return (
        <div className={styles["login-page"]}>
            <ErrorSnackbar error={loginError} />
            <div className={styles.container}>
                <div className={styles["left-section"]}>
                    <h1 className={styles["signin-text"]}>Sign In</h1>
                    <p className={styles["login-text"]}>
                        <div className={styles["button-container"]}>
                            <button
                                data-testid="homeButton"
                                type="button"
                                className={`${styles.button} ${styles["go-home"]}`}
                                onClick={() => navigate("/")}
                            >
                                Back To Homepage
                            </button>
                        </div>
                        Log into your existing BEAPENGINE account
                    </p>
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
                        <div className={`${styles["input-field"]} ${styles["first-input-field"]}`}>
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
                            <button
                                data-testid="submitButton"
                                type="submit"
                                className={`${styles.button} ${styles["sign-in"]}`}
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                    <a href="/privacy-policy" target="_blank">
                        Privacy Policy
                    </a>
                </div>
                <div className={styles["right-section"]}>
                    <h1>
                        <span className={styles.beap}>BEAP</span>
                        <span className={styles.engine}>ENGINE</span>
                    </h1>
                    <p className={styles["research-msg"]}>JOIN OUR RESEARCH PROJECT</p>
                    <div className={styles["text-slider"]}>
                        <p data-testid="textZone" className={styles["helpful-msg"]}>
                            {texts[currentIndex]}
                        </p>
                        <div className={styles["fwd-bck-container"]}>
                            <button
                                data-testid="previousButton"
                                type="button"
                                className={styles["button-img"]}
                                onClick={handlePrevious}
                            >
                                <img className={styles["arrow-img"]} src={leftArrow} alt="arrow" />
                            </button>
                            <button
                                data-testid="forwardButton"
                                type="button"
                                className={styles["button-img"]}
                                onClick={handleNext}
                            >
                                <img className={styles["arrow-img"]} src={rightArrow} alt="arrow" />
                            </button>
                        </div>
                    </div>
                    <div className={styles["cta-box"]}>
                        <div className={styles["text-container"]}>
                            <p className={`${styles["cta-text"]} ${styles["no-account"]}`}>
                                No account?
                            </p>
                            <p className={styles["cta-text"]}>Get started for free</p>
                        </div>
                        <button
                            data-testid="signupNavigate"
                            type="button"
                            className={`${styles.button} ${styles["sign-up"]} ${styles["sign-up-button"]}`}
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
