import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './modules/dashboard';

function App() {
  
  return (
    <>
      <div>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
        </Routes>
       </Router>
      </div>
    </>
  )
}

export default App
