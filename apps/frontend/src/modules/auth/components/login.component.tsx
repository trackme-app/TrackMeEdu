import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/services/auth/authProvider';

export const Login: React.FC = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        // Check if all fields are filled
        const allFieldsFilled = Object.values(updatedFormData).every(
            (field) => field.trim() !== ''
        );
        setIsButtonDisabled(!allFieldsFilled);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // demo: accept any non-empty username
            if (!formData.username) {
                setError('Please enter a username');
                return;
            }
            await auth.login(formData.username, formData.password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err?.message || 'Login failed');
        }
    };

    const containerStyle: React.CSSProperties = {
        padding: 24,
        maxWidth: 420,
        margin: '40px auto',
        color: 'var(--text-color)',
        borderRadius: 8,
        boxShadow: '0 6px 20px rgba(2,6,23,0.6)',
        backgroundColor: 'var(--nav-color)',
    };

    const inputStyle: React.CSSProperties = {
        width: '90%',
        padding: '10px 12px',
        borderRadius: 6,
        border: 'var(--bg-color)',
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontSize: 14,
    };

    const buttonStyle: React.CSSProperties = {
        width: '60%',
        padding: '10px 14px',
        borderRadius: 8,
        border: 'none',
        color: 'var(--text-color)',
        fontWeight: 600,
        marginTop: 8,
        backgroundColor: 'var(--button-color-pos)',
        opacity: isButtonDisabled ? 0.5 : 1,
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
    };

    return (
        <div
            style={{
                paddingTop: 40,
                paddingBottom: 80,
                minHeight: '100vh',
                boxSizing: 'border-box',
            }}
        >
            <div style={containerStyle}>
                <h2 style={{ marginTop: 0 }}>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                        <label
                            htmlFor="username"
                            style={{ display: 'block', marginBottom: 6 }}
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label
                            htmlFor="password"
                            style={{ display: 'block', marginBottom: 6 }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </div>
                    {error && (
                        <div style={{ color: 'var(--button-color-neg)', marginBottom: 8 }}>
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={isButtonDisabled}
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};
