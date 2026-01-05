import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authProvider';

export const RequireNoAuth: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const auth = useAuth();
    const location = useLocation();

    if (auth.isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RequireNoAuth;
