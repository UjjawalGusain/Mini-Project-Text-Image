import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
import ProtectedRoute from './components/protectedRoutes/ProtectedRoute';
import Home from './components/pages/Home';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Home route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute element={<Home />} />
            }
          />
          
          {/* Unprotected Dashboard route */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
