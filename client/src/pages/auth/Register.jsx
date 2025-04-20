import React, { useState } from "react";
import api from '../../services/api';
import { useNavigate } from "react-router-dom"; // For redirection after registration

const Register = () => {
  const [role, setRole] = useState("student");
  const [name, setName] = useState(""); 
  const [usn, setUsn] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate(); 

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Sending user data to backend for registration
      const response = await api.post("/auth/register", {
        name,
        usn: role === "student" ? usn : null, // Send USN only for students
        email,
        password,
        role,
      }); //format:api.post(url, data, config)

      // Handle successful registration (maybe show a success message)
      alert("Registration successful. Please log in.");
      navigate("/login"); // Redirect user to login page after successful registration
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "500px" }}>
      <h3>Register ({role})</h3>

      {/* Role selection buttons */}
      <div className="d-flex justify-content-around mb-3">
        <button
          onClick={() => setRole("student")}
          className={`btn ${role === "student" ? "btn-primary" : "btn-outline-primary"}`}
        >
          Student
        </button>
        <button
          onClick={() => setRole("host")}
          className={`btn ${role === "host" ? "btn-primary" : "btn-outline-primary"}`}
        >
          Host
        </button>
      </div>

      {/* Registration form */}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state
          required
        />
        {role === "student" && (
          <input
            type="text"
            className="form-control mb-3"
            placeholder="USN"
            value={usn}
            onChange={(e) => setUsn(e.target.value)} // Update USN state for students
            required
          />
        )}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
