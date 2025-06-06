import React, { useState } from 'react'
// import twitterImage from '../../assets/image/twitter.jpeg';
// import TwitterIcon from '@mui/icons-material/Twitter';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';

import auth from '../../firebase.init';
import './Login.css'

import GoogleButton from 'react-google-button'
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setError] = useState('');

  const Navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

  const handleSubmit = e => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  }

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  }

  if (user || googleUser) {
    Navigate('/');
    console.log(googleUser)
    console.log(user);
  }
  if (error) {
    console.log(error.message);
  }
  if (loading) {
    console.log('Loading...');
  }

  return (
    <div className='login-container'>
      {/* <div className="image-container">
        <img className='image' src={twitterImage} alt="twitter" />
      </div> */}
      <div className="form-container">
        <div className="form-box">
          {/* <TwitterIcon style={{ color: 'skyblue' }} /> */}
          <h2 className='heading'>Happening Now</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" className='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <div className='btn-login'>
              <button type='submit' className="btn">Login</button>
            </div>
          </form>
        </div>
        {/* <br /> */}
        <div className='google-button'>
          <GoogleButton className='g-btn' type='light' onClick={handleGoogleSignIn} />
        </div>
        <div>
          Don't have an account?
          <Link to='/signup' style={{ textDecoration: "none", color: 'skyblue', fontWeight: "600", marginLeft: '5px' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  )

}

export default Login