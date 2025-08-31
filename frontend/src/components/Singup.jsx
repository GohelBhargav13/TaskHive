import { useState } from "react";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router";
import { set } from "mongoose";

function Singup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.singUp(email, password, username);

      if (data.StatusCode >= 400) {
        setError(Message.message || "Error in Singup");
      } else {
        setSuccessMessage(
          data.message || "Singup Successfull Plaese Verify Your Email",
        );
        setTimeout(async () => {
          const resposne = await apiClient.verifyEmail(data.user.hashedToken);
          if (resposne.data.StatusCode >= 400) {
            setError(resposne.data.message || "Error in Email Verification");
            return;
          } else {
            navigate("/login");
          }
        }, 2000);

        setSuccessMessage("");
      }
    } catch (error) {
        setError(error.message || "Error in Singup CATCH");
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Singup</h2>
      {(error && <p>Error:{error}</p>) ||
        (successMessage && <p>Success:{successMessage}</p>)}
      <form method="POST" className="form-group" onSubmit={handleSubmit}>
        <label htmlFor="Name">Email: </label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <label htmlFor="Name">Password: </label>
        <input
          type="text"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br />
        <label htmlFor="Username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "singup...." : "singup"}
        </button>
      </form>
    </div>
  );
}

export default Singup;
