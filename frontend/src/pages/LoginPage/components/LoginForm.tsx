// Importing necessary libraries and hooks
import React, { FormEvent, useState } from "react";
import { login } from "../../../hooks/Api";

// LoginForm component
export default function LoginForm(): React.ReactElement {
  // State hooks to store the username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle the form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      // Attempt to login with the provided username and password
      const data = await login({ username, password });
      console.log("Login successful", data); // Log success message
    } catch (error) {
      console.error("Login failed", error); // Log error message
    }
  };

  // Render the login form
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">
        Username:
        {/* Input field to enter the username */}
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label htmlFor="password">
        Password:
        {/* Input field to enter the password */}
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {/* Submit button */}
      <button type="submit">Log in</button>
    </form>
  );
}
