import { useUser } from '@/context/userContext';
import React, { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useUser();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error('Please log in to access this page');
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null; 
  }
  return <Component {...rest} />;
};

export default ProtectedRoute;