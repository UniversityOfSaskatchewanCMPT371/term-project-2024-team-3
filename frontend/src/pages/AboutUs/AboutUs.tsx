import React, { ReactElement, ReactNode, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { FaUserCircle } from "react-icons/fa";
import { useRollbar } from "@rollbar/react";
import styles from "./AboutUs.module.css";
import beapLogo from "../../assets/beap_lab_hex_small.png";

interface SectionProps {
    title: string;
    children: ReactNode;
}

interface ContributorProps {
    name: string;
}

const Section = memo(({ title, children }: SectionProps) => {
    const rollbar = useRollbar();
    try {
        // Runtime assertions
        if (typeof title !== "string") {
            throw new Error("title must be a string");
        }
        if (!React.isValidElement(children)) {
            throw new Error("children must be a valid React element");
        }
    } catch (error) {
        rollbar.error(error);
    }

    return (
        <Fade duration={500}>
            <motion.section
                className={styles.section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.h2
                    className={styles.subtitle}
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className={styles.text}
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.p>
            </motion.section>
        </Fade>
    );
});

const Contributor = memo(({ name }: ContributorProps) => {
    const rollbar = useRollbar();
    try {
        // Runtime assertions
        if (typeof name !== "string") {
            throw new Error("name must be a string");
        }
    } catch (error) {
        rollbar.error(error);
    }
    return (
        <motion.div
            className={styles.contributorCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
        >
            <FaUserCircle size={24} />
            <h3>{name}</h3>
        </motion.div>
    );
});

function AboutUs(): ReactElement {
    const contributors = [
        "Dr. Daniel Fuller (PhD Public Health)",
        "Dr. Arastoo Borzogi (PhD Computer Science)",
        "Dr. Javad Rahimipour Anaraki (PhD Computer Science)",
        "Farza Dorani (MSc Computer Science)",
        "SeyedJavad KhataeiPour (MSc Computer Science)",
        "Dr. Rebecca Maher (MD)",
        "Nana Abekah (BSc Computer Science)",
        "Brianne Chafe (MSc Human Kinetics and Recreation)",
        "Dr. Jonathan Slaney (MD)",
        "Machel Rayner (Msc Public Health)",
        "Glenn Tanjoh Jong (Bsc Computer Science)",
        "Kamal Zrein (Bsc Computer Science)",
        "Ardalan Askarian (Bsc Computer Science)",
        "Daniel Benesh (Bsc Computer Science)",
        "Ralph Gregorio (Bsc Computer Science)",
        "Juan Arguello Escalante (Bsc Computer Science)",
        "Eric Buell (Bsc Computer Science)",
        "Cameron Beattie (Bsc Computer Science)",
        "Jozua Villegas (Bsc Computer Science)",
        "Marcus Kruger (Bsc Computer Science)",
    ].map((name) => ({ id: uuidv4(), name }));

    return (
        <div className={styles.container}>
            <div className={styles.brand}>
                <a href="/">
                    <img
                        src={beapLogo}
                        style={{ height: "120px", width: "auto", marginTop: "10px" }}
                        alt="Beap Logo"
                    />
                </a>
            </div>
            <h1 className={styles.title}>About Us</h1>
            <Section title="Our Mission">
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
                <p className={styles.text}>
                    BEAP Engine is a research project developed by Dr. Daniel Fuller and the Built
                    Environment and Active Populations (BEAP) Lab. The purpose of this study is to
                    collect and analyze large volumes of Apple Watch and Fitbit data and develop
                    methods to standardize across device. We provide you with a CSV file of your
                    data and give you detailed information about sedentary behaviour, and moderate
                    to vigorous activity based on our machine learning methods. This project is
                    approved by the Memorial University Interdisciplinary Committee on Ethics in
                    Human Research (<strong>ICEHR # 20210162-HK</strong>). The full ethics policy is
                    available at{" "}
                    <a href="/privacy-policy" className={styles.link}>
                        Privacy Policy
                    </a>
                </p>
                <p className={styles.text}>
                    {" "}
                    <strong>Support:</strong>
                </p>
                <p className={styles.text}>
                    This is an ongoing project and we are always editing the site to improve
                    functionality. If you experience an error please contact Dr. Daniel Fuller (
                    <a href="mailto:daniel.fuller@usask.ca" className={styles.link}>
                        daniel.fuller@usask.ca
                    </a>
                    ) with a screenshot and description of the error.
                </p>
            </Section>
            <Section title="Contributors">
                <ul className={styles.list}>
                    {contributors.map(({ id, name }) => (
                        <Contributor key={id} name={name} />
                    ))}
                </ul>
            </Section>
        </div>
    );
}

export default AboutUs;
