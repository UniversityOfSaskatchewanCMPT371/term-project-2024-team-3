import React, { ReactElement } from "react";
import Rollbar from "rollbar";
import { Button, Icon } from "@mui/material";
import style from "./HomePage.module.css";
import AppleWatchPdf from "../../assets/AppleWatch.pdf";
import FitbitPdf from "../../assets/Fitbit.pdf";
import beapLogo from "../../assets/beap_lab_hex_small.jpg";
import engineOverview from "../../assets/engine-overview.png";

function HomePage(): ReactElement {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "production",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached Home page");

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
        <div className={style.page_body}>
          <h1>BEAP ENGINE</h1>
          <h6>Accurately Process Your Fitness Data</h6>
          <div style={{ marginTop: "10px", display: "flex" }}>
            {/* {_user ? (
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#F74848" }}
                  size="large"
                  href="/file-upload"
                >
                  Go To File Upload
                </Button>
              </span>
            ) : ( */}
            <span>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#36BDC4", marginRight: "15px" }}
                size="large"
                href="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#FFB41A" }}
                size="large"
                href="/signup"
              >
                Sign Up
              </Button>
            </span>
            {/* )} */}
          </div>
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
            BEAP Engine is a research project developed by Dr. Daniel Fuller and
            the{" "}
            <a
              href="http://www.beaplab.com/home/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "#1D84EF" }}
            >
              Built Environment and Active Populations (BEAP) Lab
            </a>
            . The purpose of this study is to collect and analyze large volumes
            of Apple Watch and Fitbit data and develop methods to standardize
            across device. We provide you with a CSV file of your data and give
            you detailed information about sedentary behaviour, and moderate to
            vigorous activity based on our machine learning methods. We hope you
            will participate in our study.
          </span>
        </div>
        <div className={style.bottom}>
          <img src={engineOverview} alt="Beap engine overview" />
        </div>
      </section>
      <section className={style.extract_data}>
        <div>
          <a href="/login">
            Login <Icon className={style.arrow_right}>arrow_right_alt</Icon>
          </a>
          <a href="/signup">
            SignUp <Icon className={style.arrow_right}>arrow_right_alt</Icon>
          </a>
        </div>
        <h4>
          The proposal for this research has been reviewed by the
          Interdisciplinary Committee on Ethics in Human Research and found to
          be in compliance with Memorial University’s ethics policy. If you have
          ethical concerns about the research, such as the way you have been
          treated or your rights as a participant, you may contact the
          Chairperson of the ICEHR at icehr@mun.caor by telephone at
          709-864-2861
        </h4>
        <span>
          <Icon>copyright</Icon>2020 BEAP Lab
        </span>
      </section>
    </div>
  );
}

export default HomePage;
