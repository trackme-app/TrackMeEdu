import React, { useEffect } from 'react';

interface HealthResponse {
    status: string;
}

export const HealthCheck: React.FC = () => {
    useEffect(() => {
        const checkHealth = async (): Promise<HealthResponse> => {
            const response = await fetch('/api/v1/health');

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }

            return response.json() as Promise<HealthResponse>;
        };

        checkHealth().catch((error) => {
            console.error('Health check failed:', error);
        });
    }, []);

    return null;
};
