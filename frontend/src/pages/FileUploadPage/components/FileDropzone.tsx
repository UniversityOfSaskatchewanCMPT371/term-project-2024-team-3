import React, { ReactElement, useEffect, useState } from "react";
import { useRollbar } from "@rollbar/react";
import { WatchType } from "shared/api";
import Zip from "jszip";
import Dropzone, { IDropzoneProps, IStyleCustomization } from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import FileIcon from "components/Icons";
import { Stack } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

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

type Props = {
    fileType: WatchType;
    handleUpload: (form: FormData, year: string, watchType: WatchType) => Promise<void>;
    onProgressChange: (percentage: number, message: string, isVisible: boolean) => void;
};

function FileDropZone({
    fileType,
    handleUpload,
    onProgressChange,
}: Props): ReactElement<typeof Dropzone> {
    const rollbar = useRollbar();

    const [files, setFiles] = useState<Array<UploadedFile>>([]);
    const [isUpdatePreview, setIsUpdatePreview] = useState(false);

    useEffect(() => {
        const clearFiles = () => {
            files.forEach((file) => {
                file.remove();
            });
            setFiles([]);
        };

        clearFiles();
    }, [fileType]);

    const uploadFiles = async () => {
        const filesToZip = [...files];
        const totalTasks = filesToZip.length + 1;
        onProgressChange(0, `Preparing ${totalTasks} files for upload`, true);
        rollbar.debug(`Preparing ${totalTasks} files for upload`);

        const zip = new Zip();
        if (totalTasks < 1) {
            onProgressChange(100, "Done", false);
            return;
        }
        let tasksDone = 0;

        filesToZip.forEach((file) => {
            tasksDone += 1;
            const progressPercentage = Math.round((tasksDone / totalTasks) * 100);
            onProgressChange(progressPercentage, `Zipping ${file.file.name}`, true);
            zip.file(file.file.name, file.file);
        });

        zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
        }).then(async (content) => {
            const formData = new FormData();
            const uuid = uuidv4();
            formData.set("fname", `${uuid}.zip`);
            formData.set("data", content);
            rollbar.info("Sending upload");
            tasksDone += 1;
            const progressPercentage = Math.round((tasksDone / totalTasks) * 100);
            onProgressChange(progressPercentage, `Uploading your files`, true);

            await handleUpload(formData, fileType, fileType).then(() => {
                filesToZip.forEach((f) => f.remove());
                setFiles(() => {
                    onProgressChange(100, `Done!`, true);
                    return [];
                });
            });
            rollbar.info("Successful upload");
        });
    };

    const handleChangeStatus: IDropzoneProps["onChangeStatus"] = ({ file, remove }, status) => {
        setTimeout(() => {
            if (status === "done") {
                setFiles((prevData) => {
                    const exists = prevData.some((f) => f.file === file);
                    if (!exists) {
                        return [...prevData, { file: file, remove: remove }];
                    }
                    return prevData;
                });
            }
        }, 500);

        if (status === "removed") {
            setFiles((prevData) => prevData.filter((f) => f.file !== file));
        }

        // Makes sures we rerender the dropzone
        setIsUpdatePreview(!isUpdatePreview);
    };

    const handleSubmit: IDropzoneProps["onSubmit"] = async () => {
        await uploadFiles();
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
            accept={fileType === WatchType.FITBIT ? "application/json" : "text/xml"}
            styles={dropzoneStyle}
            data-testid="dropZone"
        />
    );
}

export default FileDropZone;
