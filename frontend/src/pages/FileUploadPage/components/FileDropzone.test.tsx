import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
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

jest.mock(
  "./FileDropzoneControls",
  () =>
    function () {
      return <span>FileDropzoneControls</span>;
    },
);

test(" TID 1.6. Renders FileDropzone components", () => {
  const { getByText } = render(<FileDropzone />);
  getByText("FileDropzoneControls");
});

test("invoke onDragEnter when dragenter event occurs", async () => {
  const file = new File([JSON.stringify({ ping: true })], "ping.json", {
    type: "application/json",
  });
  const data = mockData([file]);
  const { getByTestId, container, rerender, getByText } = render(
    <FileDropzone />,
  );
  getByText("Drop files here, or");
  getByText("Open File Dialog");
  const dropzone = getByTestId("dropZone");
  dispatchEvt(dropzone, "drop", data);
  waitFor(() => getByText("Drop the files here..."));

  await flushPromises(rerender, <FileDropzone />);

  expect(container.querySelectorAll("li")).toHaveLength(1);
  expect(container.querySelectorAll("li")[0].textContent).toEqual(
    "ping.json - 13 bytes",
  );
});
