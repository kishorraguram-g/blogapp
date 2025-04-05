import { useState } from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  console.log(process.env.REACT_APP_API_URL)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  async function register(ev) {
    ev.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 201) {
      alert("✅ Registration successful");
      navigate("/login");
    } else if (response.status === 400) {
      alert("⚠️ Account already exists");
    } else {
      alert("❌ Registration failed");
      console.log("Response:", response);
      console.log("Response Body:", await response.text());
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
