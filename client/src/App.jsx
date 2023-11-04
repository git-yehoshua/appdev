import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './modules/dashboard';
import Admin from './modules/admin';

function App() {
  
  return (
    <>
      <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path='/admin' element ={<Admin/>} />
        </Routes>
       </Router>
      </div>
    </>
  )
}

export default App
