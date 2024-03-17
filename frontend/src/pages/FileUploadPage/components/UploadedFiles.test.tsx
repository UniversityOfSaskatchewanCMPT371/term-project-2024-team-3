import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UploadedFiles from "./UploadedFiles";

async function flushPromises(rerender: any, ui: React.ReactElement) {
    await act(() => waitFor(() => rerender(ui)));
}

interface FileInfo {
    id: number;
    data: Uint8Array;
    type: jest.Mocked<File>;
    processedDataId: number;
    dateTime: Date;
}
