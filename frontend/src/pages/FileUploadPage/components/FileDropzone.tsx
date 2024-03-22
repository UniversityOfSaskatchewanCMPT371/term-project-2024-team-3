import React, { ReactElement, useEffect, useState } from "react";
import { useRollbar } from "@rollbar/react";
import { WatchType } from "shared/api";
import Zip from "jszip";
import Dropzone, { IDropzoneProps, IStyleCustomization } from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import FileIcon from "components/Icons";
import { Stack } from "@mui/material";

const dropzoneStyle: IStyleCustomization<React.CSSProperties> = {
    dropzone: {
        height: "432px",
        background: "#F8F8F8",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "15px",
    },
    input: {
        color: "black",
        fontFamily: "'Inter', sans-serif",
    },
    inputLabel: {
        color: "#B7B7B7",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
    },
    inputLabelWithFiles: {
        color: "black",
        fontFamily: "'Inter', sans-serif",
    },
    submitButton: {
        backgroundColor: "#FFD172",
        color: "black",
        fontFamily: "'Inter', sans-serif",
    },
};

interface UploadedFile {
    file: File;
    remove: () => void;
}
interface UploadedFiles {
    [key: string]: UploadedFile[];
}

type Props = {
    fileType: WatchType;
    handleUpload: (form: FormData, year: string, watchType: WatchType) => Promise<void>;
};

function FileDropZone({ fileType, handleUpload }: Props): ReactElement<typeof Dropzone> {
    const rollbar = useRollbar();

    const [filesPerYear, setFilesPerYear] = useState<UploadedFiles>({});
    const [isUpdatePreview, setIsUpdatePreview] = useState(false);

    useEffect(() => {
        const clearFiles = () => {
            Object.values(filesPerYear).forEach((fileArray) => {
                fileArray.forEach((file) => {
                    file.remove();
                });
            });
            setFilesPerYear({});
        };

        clearFiles();
    }, [fileType]);

    /**
     * For fitbit files parse the year out of the files name
     * Can be used for any file but currently only fitbit files are expected to have a year in their name
     * Precondition: year is full year (2019) not last 2 digits (19)
     * Returns: The year or undefined if no year is found
     */
    const getYear = (fName: string): string => {
        // check if the year is the last number in the date
        console.debug("Parsing year from: ".concat(fName));

        let fullDate = fName.match("[0-9]{2}([-/ .])[0-9]{2}[-/ .][0-9]{4}");
        if (fullDate) {
            const splitDate = fullDate[0].split(fullDate[1]);
            rollbar.debug("Year is the last number: ".concat(splitDate[2]));
            return splitDate[2];
        }

        // check if the year is the first number in the date
        fullDate = fName.match("[0-9]{4}([-/ .])[0-9]{2}[-/ .][0-9]{2}");
        if (fullDate) {
            const splitDate = fullDate[0].split(fullDate[1]);
            rollbar.debug("Year is the first number: ".concat(splitDate[0]));
            return splitDate[0];
        }

        if (fileType === WatchType.APPLE_WATCH) {
            return "Apple Export";
        }
        return "Fitbit Export";
    };

    const uploadFiles = async (year: string) => {
        rollbar.debug("Upload called with year: ".concat(year));
        const files = { ...filesPerYear };
        console.assert(Object.keys(files).includes(year), "Year doesn't have any files");
        const filesToZip = [...files[year]];
        const zip = new Zip();
        if (filesToZip.length < 1) {
            return;
        }

        filesToZip.forEach((file) => {
            zip.file(file.file.name, file.file);
        });
        await zip
            .generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 6 },
            })
            .then(async (content) => {
                const formData = new FormData();
                formData.set("fname", `${year}-${filesToZip.length}.zip`);
                formData.set("data", content);
                rollbar.info("sending upload");
                await handleUpload(formData, year, fileType).then(() => {
                    filesToZip.forEach((f) => f.remove());
                    delete files[year];
                    setFilesPerYear((prevData) => {
                        const newData = { ...prevData };
                        delete newData[year];
                        return newData;
                    });
                });
            });
    };

    const handleChangeStatus: IDropzoneProps["onChangeStatus"] = (
        { meta, file, remove },
        status
    ) => {
        setTimeout(() => {
            if (status === "done") {
                setFilesPerYear((prevData) => {
                    const files = { ...prevData };
                    const year = getYear(meta.name);
                    if (files[year]) {
                        const isDuplicate = files[year].filter((item) => item.file === file).length > 0;
                        if (!isDuplicate) {
                            files[year].push({
                                file: file,
                                remove: remove,
                            });
                        }
                    } else {
                        files[year] = [
                            {
                                file: file,
                                remove: remove,
                            },
                        ];
                    }
                    return files;
                });
            }
    
            if (status === "removed") {
                setFilesPerYear((prevData) => {
                    const files = { ...prevData };
                    const year = getYear(meta.name);

                    if (!files[year]) {
                        return files;
                    }

                    files[year] = files[year].filter((item) => item.file !== file);
                    if (files[year].length === 0) {
                        delete files[year];
                    }
                    return files;
                });
            }

            // Makes sures we rerender the dropzone
            setIsUpdatePreview(!isUpdatePreview);
        }, 500)
    };

    const handleSubmit: IDropzoneProps["onSubmit"] = () => {
        const years = Object.keys(filesPerYear);
        years.forEach(async (year) => {
            await uploadFiles(year);
        });
    };

    return (
        <Dropzone
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            inputContent={
                <Stack justifyContent="center" alignItems="center" spacing={2}>
                    <FileIcon />
                    <span>Drop items here or Browse Files</span>
                </Stack>
            }
            submitButtonContent="Upload"
            accept={fileType === WatchType.FITBIT ? "application/json" : "application/xml"}
            styles={dropzoneStyle}
        />
    );
}

export default FileDropZone;
