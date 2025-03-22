import React, { ReactElement } from "react";
import { Container, Stack } from "@mui/material";
import styles from "./MaintenancePage.module.css";

function MaintenancePage(): ReactElement {
    return (
        <Container sx={{ marginTop: 6 }}>
            <Stack spacing={2}>
                <h3 className={styles.title}>Website Under Maintenance</h3>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <div className={styles.message}>
                        <p>
                            We are currently doing major upgrades to the BeapEngine to accommodate
                            changes to the data format for Fitbit devices
                        </p>
                        <p>Please check back soon!</p>
                    </div>
                </Stack>
            </Stack>
        </Container>
    );
}

export default MaintenancePage;
