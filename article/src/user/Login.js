import { useState } from "react";
export default function Login({ dispatch }) {
  const [username, setUsername] = useState("");
  const handleUsername = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN", username });
  };

  return (
    <form onSubmit={handleUsername}>
      <label htmlFor="login-username">Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        name="login-username"
        id="login-username"
      />
      <label htmlFor="login-password">Password:</label>
      <input type="password" name="login-password" id="login-password" />
      <input type="submit" value="Login" disabled={!username} />
    </form>
  );
}
