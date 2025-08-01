import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to ChatConnect</h1>
          <p>Connect with friends and colleagues in real-time chat rooms</p>

          <div className="features">
            <div className="feature">
              <h3>🚀 Instant Messaging</h3>
              <p>Real-time communication with WebSocket technology</p>
            </div>
            <div className="feature">
              <h3>🏠 Create Rooms</h3>
              <p>Create your own chat rooms or join existing ones</p>
            </div>
            <div className="feature">
              <h3>👥 User Management</h3>
              <p>See who's online and manage your conversations</p>
            </div>
          </div>

          <div className="cta-buttons">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
