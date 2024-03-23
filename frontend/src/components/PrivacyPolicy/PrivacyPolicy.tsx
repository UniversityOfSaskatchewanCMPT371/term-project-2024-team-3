import React, { ReactElement } from "react";
import invariant from "invariant";
import { useRollbar } from "@rollbar/react";
import styles from "./PrivacyPolicy.module.css";
import beapLogo from "../../assets/beap_lab_hex_small.png";

function PrivacyPolicy(): ReactElement {
    const rollbar = useRollbar();
    invariant(rollbar, "Rollbar context is not available");
    rollbar.info("Reached Privacy Policy page");
    return (
        <div className={styles.container}>
            <div className={styles.brand}>
                <img
                    src={beapLogo}
                    style={{ height: "120px", width: "auto", marginTop: "10px" }}
                    alt="Beap Logo"
                />
            </div>
            <h1 className={styles.title}>Consent to Take Part in Research</h1>
            <h2 className={styles.subtitle}>BEAPEngine</h2>
            <p className={styles.text}>
                Researcher(s): Dr. Daniel Fuller (
                <a href="mailto:dfuller@mun.ca" className={styles.link}>
                    dfuller@mun.ca
                </a>
                ;
                <a href="tel:7098647270" className={styles.link}>
                    (709) 864-7270
                </a>
                )
            </p>
            <div className={styles.section}>
                <h2>Introduction/ Background to the study</h2>
                <p className={styles.text}>
                    Smartphones and smart devices (e.g. Apple Watches) have become more affordable
                    and are currently owned by billions of individuals across the world. They are
                    often equipped with sensors e.g. global positioning system (GPS), accelerometer
                    and biosensors that monitor heart rate, steps and calories. These devices could
                    potentially provide valuable information about individuals’ physical activity
                    behaviours in “real life” situations without the need of additional devices.
                    Furthermore, given that many individuals are already carrying their smart
                    watches with them throughout the day, it would make it easier to ensure future
                    participants are following study guidelines for tracking activity. Moreover,
                    since most people own smart watches, they could greatly minimize the cost of
                    future physical activity studies and data collection.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Purpose of the study</h2>
                <p className={styles.text}>
                    Our purpose of this study is to collect and analyze large volumes of Apple Watch
                    and Fitbit data and develop methods to standardize across device brands (and
                    potentially devices). A secondary purpose is to continue to develop and refine
                    our previous work using machine algorithms to predict lying down, sitting, and
                    light, moderate, and vigorous physical activity.
                </p>
            </div>
            <div className={styles.section}>
                <h2>What will happen if I take part in the study?</h2>
                <p className={styles.text}>
                    You will be asked to download your raw physical activity data from your FitBit
                    or Apple Watch data and upload those data to the BEAP Engine. The BEAP Engine
                    will collect your data and process the data into sedentary time, light activity,
                    and moderate to vigorous activity. We will ask you to create an account and
                    answer some questions about your age, gender, height, and weight. We will then
                    ask you to upload your wearable device data to the portal. We use algorithms
                    that we have been developed in the{" "}
                    <a
                        href="http://www.beaplab.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        BEAP Lab
                    </a>{" "}
                    to process the data. As a participant you will also be able to download your
                    processed data in Comma Separated Value format readable in Microsoft Excel. A
                    copy of the downloadable data is stored securely on the BEAP Engine. You can
                    upload or download your data as many times as you would like. All the
                    interactions between the users and BEAP Engine are secured using some encryption
                    mechanisms. Also, any data related to the users, such as their credentials and
                    activity data, are stored encrypted on the Backup servers and databases.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Withdrawal from Study</h2>
                <p className={styles.text}>
                    It is entirely up to you to decide whether or not to take part in this research.
                    If you choose not to take part in this research or if you decide to withdraw
                    after the research it has started, it will not affect you. At any point during
                    this study you may ask to discontinue participation by deleting your user
                    account. If you delete your user account, any data you have uploaded will also
                    be destroyed.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Possible Benefits</h2>
                <p className={styles.text}>
                    As a participant you will also be able to download your data in an accessible
                    format (Comma Separated Value) readable in Microsoft Excel.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Possible Risks</h2>
                <p className={styles.text}>
                    There is always a risk of your data being stolen or compromised when it is
                    transmitted online. We have taken all necessary precautions to secure your data
                    while it is in being transmitted and while it is being stored.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Privacy and Confidentiality</h2>
                <p className={styles.text}>
                    Confidentiality is ensuring that identities of participants are accessible only
                    to those authorized to have access. Your username and email address will not be
                    associated with your physical activity data. Instead, you will be assigned a
                    unique code. Only members of the research team will have access to the legend
                    linking your name with your ID code. We will not link your username and email
                    address to your physical activity data. There are limits to privacy and
                    confidentiality if there is a data breach and it is possible that your username
                    and email be linked to your Fitbit or Apple Watch data.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Anonymity</h2>
                <p className={styles.text}>
                    Anonymity refers to not disclosing participants’ identifying characteristics,
                    such as name or description of physical appearance. Every reasonable effort will
                    be made to maintain your anonymity. Data collected will be grouped together to
                    create averages. You will not be identified in any reports or publications. We
                    will not release individual information collected related to your height,
                    weight, age, or gender.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Storage of Data</h2>
                <p className={styles.text}>
                    Data collected from you as part of your participation in this project will be
                    hosted and/or stored electronically by Digital Ocean Webservice and is subject
                    to their privacy policy, and to any relevant laws of the country in which their
                    servers are located. Therefore, anonymity and confidentiality of data may not be
                    guaranteed in the rare instance, for example, that government agencies obtain a
                    court order compelling the provider to grant access to specific data stored on
                    their servers. If you have questions or concerns about how your data will be
                    collected or stored, please contact the researcher and/or visit the provider’s
                    website for more information before participating. The privacy and security
                    policy of the third-party hosting data collection and/or storing data can be
                    found at:{" "}
                    <a
                        href="https://www.digitalocean.com/legal/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        https://www.digitalocean.com/legal/
                    </a>
                    . All information collected including usernames and email addresses will be
                    stored on a secure server in Toronto, Canada (via Digital Ocean Webservice). Dr.
                    Daniel Fuller will be responsible for ensuring the security of the data.
                    Information collected for this study will be kept for 15 years and anonymized
                    data will share in public data repository{" "}
                    <a
                        href="https://dataverse.harvard.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        https://dataverse.harvard.edu/
                    </a>
                    , as required by Memorial University’s policy on Integrity in Scholarly
                    Research.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Reporting of Results</h2>
                <p className={styles.text}>
                    Results of this research will be published in a scientific journal and
                    disseminated through conference presentations and uploaded to the{" "}
                    <a
                        href="http://www.beaplab.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        BEAP Lab
                    </a>{" "}
                    website. We will never publish information that might identify you or any
                    participant. You may be provided with results once the study is completed if
                    requested on the consent form.
                </p>
            </div>
            <div className={styles.section}>
                <h2>Questions or Concerns</h2>
                <p className={styles.text}>
                    If you have any questions about taking part in this study, you can contact the
                    researcher who is in charge of this study. Daniel Fuller can be reached at{" "}
                    <a href="tel:7098647270" className={styles.link}>
                        (709) 864-7270
                    </a>
                    . The proposal for this research has been reviewed by the Interdisciplinary
                    Committee on Ethics in Human Research and found to be in compliance with
                    Memorial University’s ethics policy. If you have ethical concerns about the
                    research, such as the way you have been treated or your rights as a participant,
                    you may contact the Chairperson of the ICEHR at{" "}
                    <a href="mailto:icehr@mun.ca" className={styles.link}>
                        icehr@mun.ca
                    </a>{" "}
                    or by telephone at{" "}
                    <a href="tel:7098642861" className={styles.link}>
                        709-864-2861
                    </a>
                </p>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
