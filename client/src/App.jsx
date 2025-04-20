import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import AuthProvider from './context/AuthContext';  // AuthProvider should be inside Router context
import AppRoutes from './routes';  // Modular routing import

const App = () => {
  return (
    
      <BrowserRouter>  {/* Router is wrapping the entire app here */}
      <AuthProvider>
        <AppNavbar />
        <AppRoutes />
        <Footer />
        </AuthProvider>
      </BrowserRouter>
  );
};

export default App;
