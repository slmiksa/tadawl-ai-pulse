import React from 'react';
import { useNavigate } from 'react-router-dom';

const Subscriptions = () => {
  const navigate = useNavigate();

  // Redirect to packages page immediately
  React.useEffect(() => {
    navigate('/packages');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Subscriptions;