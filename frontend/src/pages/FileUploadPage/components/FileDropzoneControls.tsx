import React, { ChangeEvent, ReactElement } from "react";
import { FormControl, FormControlLabel, RadioGroup, Radio, Stack } from "@mui/material";

interface FileDropZoneControlsProps {
    onRadioChange: (event: ChangeEvent, value: string) => void;
}

function FileDropZoneControls({ onRadioChange }: FileDropZoneControlsProps): ReactElement {
    return (
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="flex-start">
            <span>Select File Type: </span>
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    defaultValue="fitbit"
                    onChange={(event, value) => onRadioChange(event, value)}
                >
                    <FormControlLabel
                        value="fitbit"
                        control={
                            <Radio
                                color="primary"
                                sx={{
                                    "&, &.Mui-checked": {
                                        color: "#5FCED3",
                                    },
                                }}
                            />
                        }
                        label="Fitbit"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="apple"
                        control={
                            <Radio
                                color="primary"
                                sx={{
                                    "&, &.Mui-checked": {
                                        color: "#5FCED3",
                                    },
                                }}
                            />
                        }
                        label="Apple Watch"
                        labelPlacement="end"
                    />
                </RadioGroup>
            </FormControl>
        </Stack>
    );
}

export default FileDropZoneControls;
