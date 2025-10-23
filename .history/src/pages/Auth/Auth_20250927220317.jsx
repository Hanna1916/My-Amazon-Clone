import React, { useState, useContext } from 'react';
import classes from './SignUp.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../Utility/Firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ClipLoader } from 'react-spinners';
import { DataContext } from '../../Components/DataProvider/DataProvider';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ signIn: false, signUp: false });

  const [{ user }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();

  
  const navStateData = useLocation();
  console.log(navStateData);

  const authHandler = async (e) => {
    e.preventDefault();
    if (e.target.name === "signIn") {
      setLoading({ ...loading, signIn: true });
      signInWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          dispatch({
            type: 'SET_USER',
            user: userInfo.user
          });
          setLoading({ ...loading, signIn: false });
          navigate(navStateData?.state?.redirect || '/');
        })
        .catch((err) => {
          setError(err.message);
          setLoading({ ...loading, signIn: false });
        });
    } else {
      setLoading({ ...loading, signUp: true });
      createUserWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          dispatch({
            type: 'SET_USER',
            user: userInfo.user
          });
          setLoading({ ...loading, signUp: false });
          navigate(navStateData?.state?.redirect || '/');
        })
        .catch((err) => {
          setError(err.message);
          setLoading({ ...loading, signUp: false });
        });
    }
  }

  return (
    <section className={classes.login}>
      <Link>
        <img src="https://assets.aboutamazon.com/2e/d7/ac71f1f344c39f8949f48fc89e71/amazon-logo-squid-ink-smile-orange.png" alt="" />
      </Link>

      <div className={classes.login_container}>
        <h1>Sign In</h1>
        {navStateData?.state?.msg && (
          <small
            style={{
              padding: "5px",
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {navStateData.state.msg}
          </small>
        )}

        <form action="">
          <div>
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" />
          </div>
          <button type="submit" onClick={authHandler} name="signIn" className={classes.login_signInButton}>
            {loading.signIn ? (<ClipLoader color='#fff' size={20} />) : ("Sign In")}
          </button>
        </form>

        <p>By signing-in you agree to Amazon's FAKE CLONE Conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.</p>

        <button type="submit" onClick={authHandler} name="signUp" className={classes.login_registerButton}>
          {loading.signUp ? (<ClipLoader color='#fff' size={20} />) : ("Create your Amazon Account")}
        </button>

        {error && <small style={{ paddingTop: '10px', color: 'red' }}>{error}</small>}
      </div>
    </section>
  );
}

export default Auth;
