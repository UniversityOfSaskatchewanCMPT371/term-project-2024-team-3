// Define a type for the user credentials
type UserCredentials = {
  username: string; // The username of the user
  password: string; // The password of the user
};

// The login function takes a UserCredentials object and attempts to log in with those credentials.
export const login = async (credentials: UserCredentials) => {
  console.log("Attempting to log in with credentials:", credentials);

  // Create a new FormData object
  const formData = new FormData();
  // Append the username and password to the FormData object
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  // Send a POST request to the login endpoint with the FormData object
  const response = await fetch("http://localhost:8080/loginuser", {
    method: "POST",
    body: formData,
  });

  // If the response is not ok (status code is not in the range 200-299), throw an error
  if (!response.ok) {
    console.error("Login failed with response:", response);
    throw new Error("Login failed");
  }

  // If the response is ok, parse the response data as JSON
  const data = await response.json();
  console.log("Login successful with data:", data);
  // Return the response data
  return data;
};

// The logout function sends a GET request to the logout endpoint to log out the current user.
export const logout = async () => {
  console.log("Attempting to log out");
  const response = await fetch("http://localhost:8080/logoutuser", {
    method: "GET",
  });

  // If the response is not ok (status code is not in the range 200-299), throw an error
  if (!response.ok) {
    console.error("Logout failed with response:", response);
    throw new Error("Logout failed");
  }

  // If the response is ok, parse the response data as JSON
  const data = await response.json();
  console.log("Logout successful with data:", data);
  // Return the response data
  return data;
};
