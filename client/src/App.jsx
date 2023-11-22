import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './modules/dashboard';
import Admin from './modules/admin';
import Login from './modules/Login';
import Signup from './modules/Signup';
import { AuthProvider, useAuth } from './components/authContext';
import NavBar from './components/NavBar';

function App() {
  
  function PrivateRoute({ element, path }) {
    const { isLoggedIn } = useAuth();
  
    return isLoggedIn ? element : <Navigate to="/login" />;
  }
  return (
    <>
    <AuthProvider>
      <div>
      <ToastContainer />
      <Router>
        <NavBar />
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/admin'
              element={<PrivateRoute element={<Admin />} path="/admin" />}
            />
        </Routes>
       </Router>
      </div>
    </AuthProvider>
      
    </>
  )
}

export default App
