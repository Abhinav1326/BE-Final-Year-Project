import './App.css';
import Navbar from './components/Navbar/Navbar';
import Form from './components/Form/Form';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './components/Login/Login';
import Signup from './components/Login/SignUp';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<Form />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<Profile />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
