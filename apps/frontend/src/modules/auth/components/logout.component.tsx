import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/services/auth/authProvider';
import Modal from '../../common/components/modal.component';

export const Logout: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    const handleCancel = useCallback(() => {
        setOpen(false);
        // go back where the user was, if possible
        navigate(-1);
    }, [navigate]);

    const handleConfirm = useCallback(() => {
        auth.logout();
        setOpen(false);
        navigate('/login', { replace: true });
    }, [auth, navigate]);

    if (!open) return null;

    return (
        <Modal
            title="Sign out"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmText="Sign out"
            cancelText="Cancel"
        >
            <p>
                Are you sure you want to sign out? You will be redirected to the
                sign-in page.
            </p>
        </Modal>
    );
};
