import React, { useState, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Login and store token
      const response = await api.post("/auth/login", { email, password, role });
      const token = response.data.token;
      
      // Store token in localStorage
      localStorage.setItem("token", token);
      
      // Wait a bit for the interceptor to pick up the new token
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 2. Get user data - now the interceptor should work properly
      const userRes = await api.get("/auth/me");
      setUser(userRes.data);
  
      alert("Login successful ✅");
  
      // 3. Redirect based on role
      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/host/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "500px", height: "80vh" }}>
      <h3 className="text-center mb-4">Login ({role})</h3>

      {/* Role selection */}
      <div className="d-flex justify-content-around mb-4">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`btn ${role === "student" ? "btn-primary" : "btn-outline-primary"} w-100 me-2`}
          style={{ maxWidth: "200px" }}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("host")}
          className={`btn ${role === "host" ? "btn-primary" : "btn-outline-primary"} w-100 ms-2`}
          style={{ maxWidth: "200px" }}
        >
          Host
        </button>
      </div>

      {/* Login form */}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
