import React, { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import invariant from "invariant";
import style from "./HomePage.module.css";
import AppleWatchPdf from "../../assets/AppleWatch.pdf";
import FitbitPdf from "../../assets/Fitbit.pdf";
import beapLogo from "../../assets/beap_lab_hex_small.png";
import engineOverview from "../../assets/engine-overview.png";

function HomePage(): ReactElement {
    const rollbar = useRollbar();
    invariant(rollbar, "Rollbar context is not available");
    rollbar.debug("Reached Home page");

    const navigate = useNavigate();
    invariant(navigate, "Navigation function is not available");

    /**
     * Handles the sign-up click event.
     * Navigates to the sign-up page.
     */
    const handleSignUpClick = () => {
        try {
            navigate("/signup");
        } catch (error) {
            rollbar.error("Error navigating to signup page", error as Error);
        }
    };

    /**
     * Handles the login click event.
     * Navigates to the login page.
     */
    const handleLoginClick = () => {
        try {
            navigate("/login");
        } catch (error) {
            rollbar.error("Error navigating to login page", error as Error);
        }
    };

    return (
        <div className={style.home}>
            <section className={style.main_page}>
                <div className={style.brand}>
                    <img
                        src={beapLogo}
                        style={{ height: "120px", width: "auto", marginTop: "10px" }}
                        alt="Beap Logo"
                    />
                </div>
                <div className={style.auth_buttons}>
                    <button type="button" onClick={handleLoginClick} className={style.login_button}>
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={handleSignUpClick}
                        className={style.signup_button}
                    >
                        Sign Up
                    </button>
                </div>
                <div className={style.page_body}>
                    <h1>BEAP ENGINE</h1>
                    <h6>Unleashing The Power Of Your Fitness Data</h6>
                </div>
                <div className={style.see_more}>
                    <a href="#desc">
                        <Icon className={style.expand_icon}>expand_more</Icon>
                    </a>
                </div>
            </section>

            <section id="desc" className={style.description}>
                <div className={style.top}>
                    <h1>How To Contribute Data</h1>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: "#333333", marginRight: "15px" }}
                            size="large"
                            href={AppleWatchPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Apple Watch Extraction Protocol
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: "#333333" }}
                            size="large"
                            href={FitbitPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Fitbit Extraction Protocol
                        </Button>
                    </div>
                    <span>
                        BEAP Engine is a research project developed by Dr. Daniel Fuller and the{" "}
                        <a
                            href="http://www.beaplab.com/home/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "underline", color: "#1D84EF" }}
                        >
                            Built Environment and Active Populations (BEAP) Lab
                        </a>
                        . The purpose of this study is to collect and analyze large volumes of Apple
                        Watch and Fitbit data and develop methods to standardize across device. We
                        provide you with a CSV file of your data and give you detailed information
                        about sedentary behaviour, and moderate to vigorous activity based on our
                        machine learning methods. We hope you will participate in our study.
                    </span>
                </div>
                <div className={style.bottom}>
                    <img src={engineOverview} alt="Beap engine overview" />
                </div>
            </section>
            <footer className={style.footer}>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/about-us">About Us</a>
            </footer>
            <section className={style.extract_data}>
                <span>
                    <Icon>copyright</Icon>2020 BEAP Lab
                </span>
            </section>
        </div>
    );
}

export default HomePage;
