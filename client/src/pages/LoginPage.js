import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./LoginPage.css";
import { Link } from "react-router-dom";

export default function LoginPage({ setProfilename, setUserId }) {
  console.log(process.env.REACT_APP_API_URL)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  // Dynamically select API URL
 
  async function login(ev) {
    ev.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        alert("✅ Login Successful");
        
        console.log("User ID:", userInfo.user.id);
        console.log("Profilename updated to:", userInfo.user.username);
        
        setUserId(userInfo.user.id);
        setProfilename(userInfo.user.username);
        setRedirect(true);
      } else {
        alert("⚠️ Invalid username or password");
      }
    } catch (err) {
      console.error("❌ Error during login:", err);
      alert("Login failed. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to="/home" />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
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
      <button type="submit">Login</button>
      <div className="Registernav">
        <Link to="/register" className="dhaccount">
          <p>Don't have an account?</p>
        </Link>
        <Link to="/register" className="registerlink">Register</Link>
      </div>
    </form>
  );
}
