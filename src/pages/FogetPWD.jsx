import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { useToast } from "@chakra-ui/react";
import Notif_Toast from "../components/Tost";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validateEmail = (value) => {
    const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    setEmailError(emailValid ? "" : "Email is invalid");
    setFormValid(emailValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValid) {
      try {
        // Encrypt the password
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          SECRET_KEY
        ).toString();

        const userData = await login({
          email,
          Password: encryptedPassword,
        }).unwrap();
        if (userData) {
          dispatch(setCredentials(userData));
          Notif_Toast(
            toast,
            "Login successful",
            "You have successfully logged in",
            "success"
          );

          navigate("/");
        }
      } catch (error) {
        Notif_Toast(toast, "Error logging in", error.data?.message, "error");
      }
    }
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row justify-content-md-center">
        <div className="card-wrapper col-12 col-md-4 mt-5">
          <div className="brand text-center mb-3">
            <a href="/">
              <img src="public/img/logo.png" alt="Logo" />
            </a>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Login</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">E-Mail Address</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${
                      emailError ? "is-invalid" : email && "is-valid"
                    }`}
                    name="email"
                    required
                    autoFocus
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <div className="invalid-feedback">{emailError}</div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    name="password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <div className="text-right">
                    <a href="password-reset.html" className="small">
                      Forgot Your Password?
                    </a>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-check position-relative mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input d-none"
                      id="remember"
                      name="remember"
                    />
                    <label
                      className="checkbox checkbox-xxs form-check-label ml-1"
                      htmlFor="remember"
                      data-icon="&#xe936"
                    >
                      Remember Me
                    </label>
                  </div>
                </div>

                <div className="form-group no-margin">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={!formValid}
                  >
                    Log in
                  </button>
                </div>
                <div className="text-center mt-3 small">
                  Don't have an account? <a href="/Signup">Sign Up</a>
                </div>
              </form>
            </div>
          </div>
          <footer className="footer mt-3">
            <div className="container-fluid">
              <div className="footer-content text-center small">
                <span className="text-muted">
                  &copy; 2019 Graindashboard. All Rights Reserved.
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;
