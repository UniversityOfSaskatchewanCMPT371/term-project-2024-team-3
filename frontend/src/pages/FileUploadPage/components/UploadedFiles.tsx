import React from "react";
// import { useRollbar } from "@rollbar/react";
// import { WatchType, RawFileData, DataType } from "shared/api";
// import useGetUploadedFiles from "shared/hooks/useGetUploadedFiles";
// import useDeleteFile from "shared/hooks/useDeleteFile";

function UploadedFiles() {
    // TODO: Sync currentFileType with the FileDropzone.
    // Can be done by lifting the state up to the FileUploadPage and passing
    // the setCurrentFileType state into the child components.
    // const [currentFileType, setCurrentFileType] = useState<WatchType>(WatchType.APPLE_WATCH);

    //  Fetch the list of uploaded files for this user given a certain watch type
    //  Will  default to fitbit if no parameter is passed in
    // const { uploadedFiles } = useGetUploadedFiles(currentFileType);

    // const { handleDelete } = useDeleteFile();

    // Mocking Data used to test the display of uploaded files.
    // const rawFileDataMock: RawFileData[] = [
    //     {
    //         id: 1,
    //         data: new Uint8Array(10),
    //         type: DataType.APPLE_WATCH,
    //         processedDataId: 100,
    //         dateTime: new Date(),
    //     },
    //     {
    //         id: 2,
    //         data: new Uint8Array(8),
    //         type: DataType.FITBIT,
    //         processedDataId: 123,
    //         dateTime: new Date(),
    //     },
    // ];

    // Refreshes the uploadedFiles state to stay updated.
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentFileType((currentFileType) => currentFileType);
    //     }, 1000); // Set interval of refresh to 1 second
    //     return () => clearInterval(intervalId);
    // }, []);

    // Maps uploadedFiles onto the screen
    // ***FIX: Currently only updates when page is refreshed. Needs to update in real time***
    // const uploadFileItems =
    //     uploadedFiles.length < 1 ? (
    //         <div>No Files Uploaded</div>
    //     ) : (
    //         uploadedFiles.map((file) => (
    //             <div
    //                 style={{
    //                     flexDirection: "row",
    //                 }}
    //             >
    //                 <li
    //                     key={String(file.id)}
    //                     style={{
    //                         paddingBottom: "5px",
    //                         paddingTop: "5px",
    //                         display: "flex",
    //                         justifyContent: "space-between",
    //                         borderBottom: "1px solid black",
    //                     }}
    //                 >
    //                     {String(file.processedDataId)}
    //                     <div style={{ display: "flex", gap: "5px" }}>
    //                         <button type="submit">Process</button>
    //                         <button
    //                             type="submit"
    //                             onClick={() => handleDelete(String(file.id), currentFileType)} // file.id does not exist. Need to fix the assigning of id.
    //                         >
    //                             Delete
    //                         </button>
    //                     </div>
    //                 </li>
    //             </div>
    //         ))
    //     );

    return (
        <div
            style={{
                width: "25%",
                padding: "10px",
            }}
        >
            <h3>Uploaded Files</h3>
            {/* {uploadFileItems} */}
        </div>
    );
}

export default UploadedFiles;
