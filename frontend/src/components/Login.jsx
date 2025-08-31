import React, { useState } from 'react';
import apiClient from "../services/apiClient";
import { useNavigate } from 'react-router';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 

   const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {

            const data = await apiClient.login(email,password)
            if(data.statusCode >= 400){
                setError(data.message || "Error in Login");
            }else{
                navigate("/getme")
            }
            
        } catch (error) {
            setError(error.message || "Error in Login CATCH");
            console.error("Error during Login:", error);
            
        }finally{
            setLoading(false);
        }
    }
  return (
    <div>
        <h2>Login</h2>
        {error && <p>Error:{error}</p>}
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
    
        <button type="submit" disabled={loading}>
          {loading ? "Loggin...." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login