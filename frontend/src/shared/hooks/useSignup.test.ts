import { renderHook } from "@testing-library/react-hooks";
import { useNavigate } from "react-router-dom";
import useSignup from "./useSignup";
import * as API from "../api";

const username = "testuser";
const password = "testpassword";
const firstName = "Test";
const lastName = "User";

jest.mock("../api");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const signupSpy = jest.spyOn(API, "signUp").mockImplementation(async () => {});

describe("useSignup", () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    });
    it("T3.14 should handle signup successfully", async () => {
        const { result } = renderHook(useSignup);
        await result.current.handleSignup(username, password, firstName, lastName);

        expect(mockNavigate).toHaveBeenCalledWith("/login");
        expect(signupSpy).toHaveBeenCalledWith(username, password, firstName, lastName);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("T3.15 should handle signup when it errors", async () => {
        signupSpy.mockImplementation(async () => {
            throw new Error("Signup failed");
        });

        const { result } = renderHook(useSignup);
        await result.current.handleSignup(username, password, firstName, lastName);

        expect(signupSpy).toHaveBeenCalledWith(username, password, firstName, lastName);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe("Signup failed");
    });
});
