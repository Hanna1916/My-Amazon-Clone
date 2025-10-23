
import React, { useState, useContext } from "react";
import classes from "./SignUp.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../Utility/";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ClipLoader } from "react-spinners";
import { DataContext } from "../../Components/DataProvider/DataProvider";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Added for sign-up
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ signIn: false, signUp: false });

  const [{ user }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  const navStateData = useLocation();

  console.log("Navigation state:", navStateData);
  console.log("Current user:", user);

  // ✅ Form validation
  const validateForm = (isSignUp = false) => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const authHandler = async (e) => {
    e.preventDefault();
    const isSignIn = e.target.name === "signIn";

    // ✅ Validate form before proceeding
    if (!validateForm(!isSignIn)) {
      return;
    }

    // ✅ Set loading state
    setLoading({
      signIn: isSignIn,
      signUp: !isSignIn,
    });

    try {
      let userInfo;

      if (isSignIn) {
        // Sign in
        userInfo = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign up
        userInfo = await createUserWithEmailAndPassword(auth, email, password);
      }

      // ✅ Dispatch user data to context
      dispatch({
        type: "SET_USER",
        user: userInfo.user,
      });

      console.log("Auth successful:", userInfo.user);

      // ✅ Navigate to redirect URL or home
      const redirectPath = navStateData?.state?.redirect || "/";
      navigate(redirectPath, {
        state: {
          msg: isSignIn
            ? "Successfully signed in!"
            : "Account created successfully!",
        },
      });
    } catch (err) {
      console.error("Auth error:", err);

      // ✅ Better error messages
      let errorMessage = err.message;
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }

      setError(errorMessage);
    } finally {
      // ✅ Reset loading state
      setLoading({ signIn: false, signUp: false });
    }
  };

  return (
    <section className={classes.login}>
      {/* ✅ Fixed Link component */}
      <Link to="/">
        <img
          src="https://assets.aboutamazon.com/2e/d7/ac71f1f344c39f8949f48fc89e71/amazon-logo-squid-ink-smile-orange.png"
          alt="Amazon Logo"
        />
      </Link>

      <div className={classes.login_container}>
        <h1>Sign In</h1>

        {/* ✅ Success message from navigation state */}
        {navStateData?.state?.msg && (
          <small
            style={{
              padding: "5px",
              textAlign: "center",
              color: "green", // ✅ Changed to green for success messages
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
            }}
          >
            {navStateData.state.msg}
          </small>
        )}

        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
              minLength={6}
            />
          </div>

          {/* ✅ Confirm Password field for sign-up */}
          <div style={{ display: loading.signUp ? "block" : "none" }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              id="confirmPassword"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            onClick={authHandler}
            name="signIn"
            className={classes.login_signInButton}
            disabled={loading.signIn || loading.signUp}
          >
            {loading.signIn ? <ClipLoader color="#fff" size={20} /> : "Sign In"}
          </button>
        </form>

        <p>
          By signing-in you agree to Amazon's FAKE CLONE Conditions of Use &
          Sale. Please see our Privacy Notice, our Cookies Notice and our
          Interest-Based Ads Notice.
        </p>

        <button
          onClick={authHandler}
          name="signUp"
          className={classes.login_registerButton}
          disabled={loading.signIn || loading.signUp}
        >
          {loading.signUp ? (
            <ClipLoader color="#fff" size={20} />
          ) : (
            "Create your Amazon Account"
          )}
        </button>

        {/* ✅ Error display */}
        {error && (
          <small
            style={{
              paddingTop: "10px",
              color: "red",
              display: "block",
              textAlign: "center",
            }}
          >
            {error}
          </small>
        )}
      </div>
    </section>
  );
}

export default Auth;
