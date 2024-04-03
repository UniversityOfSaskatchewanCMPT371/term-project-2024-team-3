import React, { useState, useEffect, FormEvent } from "react";
import useSignup from "shared/hooks/useSignup";
import { useNavigate } from "react-router-dom";
import { useRollbar } from "@rollbar/react";
import assert from "shared/util/assert";
import styles from "./SignUpPage.module.css";
import leftArrow from "../../assets/left-arrow.png";
import rightArrow from "../../assets/right-arrow.png";

const texts = [
    "Welcome to BEAPEngine, a research project founded by Dr. Daniel Fuller.",
    "Help us in our mission to improve the lives of people with disabilities.",
    "Join our community of researchers and developers to make a difference.",
    "We are looking for volunteers to help us with our research project.",
    // Add more texts here...
];

function SignUpPage() {
    const rollbar = useRollbar();
    rollbar.debug("Reached Signup page");

    const [userType, setUserType] = useState("researcher");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const { handleSignup } = useSignup();
    const navigate = useNavigate();
    const [policyChecked, setPolicyChecked] = useState(false);
    const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    /**
     * Event handler for toggling the checkbox state.
     * Toggles the state of the privacy policy checkbox.
     */
    const handleCheckboxChange = () => {
        setPolicyChecked(!policyChecked); // Toggle the checked state
    };

    /**
     * Handles the log-in click event.
     * Navigates to the log-in page.
     */
    const handleLogInClick = () => {
        assert(typeof navigate === "function", "navigate should be a function");
        navigate("/login");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((currentIndex + 1) % texts.length);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval); // Clean up on component unmount
    }, [currentIndex]);

    /**
     * Handles the click event to navigate to the next text.
     * Ensures that the texts array is not empty.
     * @pre texts array must not be empty
     * @post Advances currentIndex to the next index in the texts array.
     */
    const handleNext = () => {
        // Ensure texts array is not empty
        assert(texts.length > 0, "texts array should not be empty", rollbar);
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
        assert(texts.length > 0, "texts array should not be empty", rollbar);
        if (!(texts.length > 0)) {
            rollbar.error("Assertion failed: text display array is empty");
        }
        setCurrentIndex((currentIndex - 1 + texts.length) % texts.length);
    };

    /**
     * Handles form submission for user sign-up.
     * Validates form fields and submits the sign-up request if validation passes.
     * @param event - Form submission event
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setFormSubmitAttempted(true);
        assert(typeof username === "string", "username should be a non-null string", rollbar);
        assert(typeof firstName === "string", "first name should be a non-null string", rollbar);
        assert(typeof lastName === "string", "last name should be a non-null string", rollbar);
        assert(typeof password === "string", "password should be a non-null string", rollbar);
        // Log to Rollbar if any of the assertion fails
        if (typeof username !== "string") {
            rollbar.error("Assertion failed: username should be a non-null string");
        }
        if (typeof firstName !== "string") {
            rollbar.error("Assertion failed: first name should be a non-null string");
        }
        if (typeof lastName !== "string") {
            rollbar.error("Assertion failed: last name should be a non-null string");
        }
        if (typeof password !== "string") {
            rollbar.error("Assertion failed: password should be a non-null string");
        }
        // Check if password and password confirmation match
        if (password !== passwordConfirmation) {
            // Show an error message or handle the validation as per your UI/UX requirements
            // console.error("Password and password confirmation do not match!");
            rollbar.error("Password and password confirmation do not match!");
            return;
        }
        // check if the user has accepted the privacy policy
        if (!policyChecked) {
            // send an error if they haven't
            // console.error("Please accept the privacy policy before proceeding!");
            rollbar.error("Please accept the privacy policy before proceeding!");
            return;
        }

        await handleSignup(firstName, lastName, username, password);
    };

    return (
        <div className={styles["signup-page"]}>
            <div className={styles.container}>
                <div className={styles["left-section"]}>
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
                    <h1 className={styles["signup-text"]}>Sign Up</h1>
                    <p className={styles["createaccount-text"]}>Create a free BEAPENGINE account</p>
                    <form onSubmit={handleSubmit} className={styles["form-box"]}>
                        <div className={styles.tabs}>
                            <button
                                data-testid="researcherButton"
                                type="button"
                                className={`${styles.tab} ${styles.researcher} ${userType === "researcher" ? styles.active : ""}`}
                                onClick={() => setUserType("researcher")}
                            >
                                Researcher
                            </button>
                            <button
                                data-testid="personalUserButton"
                                type="button"
                                className={`${styles.tab} ${styles.personal} ${userType === "personal" ? styles.active : ""}`}
                                onClick={() => setUserType("personal")}
                            >
                                Personal User
                            </button>
                        </div>
                        <div className={`${styles["input-field"]} ${styles["first-input-field"]}`}>
                            <label htmlFor="firstname">First Name</label>
                            <input
                                data-testid="firstName"
                                id="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                value={firstName}
                                required
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className={styles["input-field"]}>
                            <label htmlFor="lastname">Last Name</label>
                            <input
                                data-testid="lastName"
                                id="lastName"
                                type="text"
                                placeholder="Enter your last name"
                                value={lastName}
                                required
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className={styles["input-field"]}>
                            <label htmlFor="username">Username</label>
                            <input
                                data-testid="userName"
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={styles["input-field"]}>
                            <label htmlFor="password">Password</label>
                            <input
                                data-testid="password"
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={`${styles["input-field"]} ${styles["confirm-input"]}`}>
                            <label htmlFor="passwordConfirmation">Confirm</label>
                            <input
                                data-testid="passwordConfirmation"
                                id="passwordConfirmation"
                                type="password"
                                placeholder="Confirm your password"
                                value={passwordConfirmation}
                                required
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                        </div>
                        {passwordConfirmation && password !== passwordConfirmation && (
                            <p className={styles["password-mismatch-message"]}>
                                Passwords do not match
                            </p>
                        )}
                        <div className={styles["button-container"]}>
                            <label
                                data-testid="policyAgreementLink"
                                id="policyAgreement"
                                htmlFor="policyCheck"
                            >
                                <a href="/privacy-policy" target="_blank">
                                    I agree to the terms and privacy policy
                                </a>
                            </label>
                            <input
                                data-testid="policyAgreementCheck"
                                id="policyCheck"
                                type="checkbox"
                                checked={policyChecked} // Controlled component: value depends on state
                                onChange={handleCheckboxChange} // Event handler to update state
                            />
                        </div>
                        {formSubmitAttempted && !policyChecked && (
                            <p className={styles["checkbox-error-message"]}>
                                Please accept the privacy policy.
                            </p>
                        )}
                        <div className={styles["button-container"]}>
                            <button
                                data-testid="submitButton"
                                type="submit"
                                className={`${styles.button} ${styles["sign-in"]}`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
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
                            <p className={`${styles["cta-text"]} ${styles["have-account"]}`}>
                                Already have an account?
                            </p>
                            <p className={`${styles["cta-text"]} ${styles["get-started"]}`}>
                                Log into your BEAPENGINE account
                            </p>
                        </div>
                        <button
                            data-testid="navigateSignIn"
                            type="button"
                            className={`${styles.button} ${styles["sign-up"]} ${styles["sign-in-button"]}`}
                            onClick={handleLogInClick}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
