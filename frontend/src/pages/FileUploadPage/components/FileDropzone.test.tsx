import React from "react";
import { fireEvent, act, waitFor } from "@testing-library/react";
import { renderWithProvider } from "shared/util/tests/render";
import userEvent from "@testing-library/user-event";
import { WatchType } from "shared/api";
import FileDropzone from "./FileDropzone";

async function flushPromises(rerender: any, ui: React.ReactElement) {
    await act(() => waitFor(() => rerender(ui)));
}

function dispatchEvt(node: Element, type: string, data: Object) {
    const event = new Event(type, { bubbles: true });
    Object.assign(event, data);
    fireEvent(node, event);
}

function mockData(files: Array<File>) {
    return {
        dataTransfer: {
            files,
            items: files.map((file) => ({
                kind: "file",
                type: file.type,
                getAsFile: () => file,
            })),
            types: ["Files"],
        },
    };
}

describe("Uploaded Files Page", () => {
    let mockHandleUpload: jest.Func;
    const defaultDivScroll = window.HTMLDivElement.prototype.scroll;

    beforeEach(() => {
        window.HTMLDivElement.prototype.scroll = jest.fn();
        mockHandleUpload = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        window.HTMLDivElement.prototype.scroll = defaultDivScroll;
    });

    it("T5.12 Should drop fitbit files as initial default", async () => {
        const file = new File([JSON.stringify({ ping: true })], "calories-2018-11-10.json", {
            type: "application/json",
        });
        const data = mockData([file]);

        const { rerender, getByText } = renderWithProvider(
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.FITBIT}
                handleUpload={mockHandleUpload}
            />,
        );
        const dropzone = getByText("Drop items here or Browse Files");
        dispatchEvt(dropzone, "drop", data);

        await flushPromises(
            rerender,
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.FITBIT}
                handleUpload={mockHandleUpload}
            />,
        );

        getByText("calories-2018-11-10.json, 13bytes");

        userEvent.click(getByText("Upload"));
        await waitFor(() => {
            expect(mockHandleUpload).toHaveBeenCalled();
        });
    });

    it("T5.13 Should drop only xml files as for apple watch", async () => {
        const file = new File([JSON.stringify({ ping: true })], "apple.xml", {
            type: "text/xml",
        });
        const data = mockData([file]);

        const { rerender, getByText } = renderWithProvider(
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.APPLE_WATCH}
                handleUpload={mockHandleUpload}
            />,
        );
        const dropzone = getByText("Drop items here or Browse Files");
        dispatchEvt(dropzone, "drop", data);

        await flushPromises(
            rerender,
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.APPLE_WATCH}
                handleUpload={mockHandleUpload}
            />,
        );

        getByText("apple.xml, 13bytes");

        userEvent.click(getByText("Upload"));
        await waitFor(() => {
            expect(mockHandleUpload).toHaveBeenCalled();
        });
    });

    it("T5.14 Should not be able to drop json  when apple watch is selected", async () => {
        const file = new File([JSON.stringify({ ping: true })], "calories-2018-11-10.json", {
            type: "application/json",
        });
        const data = mockData([file]);

        const { rerender, getByText, queryByText } = renderWithProvider(
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.APPLE_WATCH}
                handleUpload={mockHandleUpload}
            />,
        );
        const dropzone = getByText("Drop items here or Browse Files");
        dispatchEvt(dropzone, "drop", data);

        await flushPromises(
            rerender,
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.APPLE_WATCH}
                handleUpload={mockHandleUpload}
            />,
        );

        expect(queryByText("calories-2018-11-10.json, 13bytes")).not.toBeInTheDocument();
        expect(queryByText("Upload")).not.toBeInTheDocument();
        expect(mockHandleUpload).not.toHaveBeenCalled();
    });

    it("T5.15 Should not be able to drop xml when fitbit is selected", async () => {
        const file = new File([JSON.stringify({ ping: true })], "apple.xml", {
            type: "text/xml",
        });
        const data = mockData([file]);

        const { rerender, getByText, queryByText } = renderWithProvider(
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.FITBIT}
                handleUpload={mockHandleUpload}
            />,
        );
        const dropzone = getByText("Drop items here or Browse Files");
        dispatchEvt(dropzone, "drop", data);

        await flushPromises(
            rerender,
            <FileDropzone
                onProgressChange={jest.fn()}
                fileType={WatchType.FITBIT}
                handleUpload={mockHandleUpload}
            />,
        );

        expect(queryByText("apple.xml, 13bytes")).not.toBeInTheDocument();
        expect(queryByText("Upload")).not.toBeInTheDocument();
        expect(mockHandleUpload).not.toHaveBeenCalled();
    });
});
