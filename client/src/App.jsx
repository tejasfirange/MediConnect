import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Landing from './pages/Landing/Landing';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Assessment from './pages/Assessment/Assessment';
import Result from './pages/Result/Result';
import History from './pages/History/History';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ForgotPassword/ResetPassword'; 
import HealthTools from './pages/HealthTests/HealthTools';
import BMI from './pages/HealthTests/BMI';
import LungTest from './pages/HealthTests/LungTest';
import ReactionTest from './pages/HealthTests/ReactionTest';
import Hydration from './pages/HealthTests/Hydration';
import StressQuiz from './pages/HealthTests/StressQuiz';
import MemoryStrength  from './pages/HealthTests/memorystrenth';  

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        }
      />
      <Route path="/result" element={<Result />} />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/tests" element={<HealthTools />} />

        <Route path="/bmi" element={<BMI />} />

        <Route path="/lungs" element={<LungTest />} />

        {/* <Route path="/eye" element={<EyeTest />} /> */}

        <Route path="/reaction" element={<ReactionTest />} />

        <Route path="/hydration" element={<Hydration />} />

        <Route path="/stress" element={<StressQuiz />} />
        <Route path="/memory" element={<MemoryStrength />} />

    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} newestOnTop pauseOnFocusLoss={false} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
