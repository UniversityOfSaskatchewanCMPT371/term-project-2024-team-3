import { renderHook } from "@testing-library/react-hooks";
import useDownload from "./useDownload";
import * as API from "../Data/index";

const mockSetStorage = jest.fn();
const mockRemoveCookies = jest.fn();

jest.mock("../api");
jest.mock("usehooks-ts", () => ({
  useLocalStorage: () => ["", mockSetStorage],
}));

describe("useDownload", () => {
  it("should download a file from the database", async () => {
    // const { result } = renderHook(useDownload);
  });

  it("should handle download when it errors", async () => {
    // const { result } = renderHook(useDownload);
  });
});
