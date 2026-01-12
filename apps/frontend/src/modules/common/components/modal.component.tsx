import React from 'react';

type ModalProps = {
    title?: string;
    children?: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
};

const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
};

const boxStyle: React.CSSProperties = {
    width: '90%',
    maxWidth: 480,
    background: 'var(--modal-bg, #fff)',
    color: 'var(--modal-color, #111827)',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 10px 30px rgba(2,6,23,0.2)',
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: 18,
    cursor: 'pointer',
};

const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
};

export default function Modal({
    title,
    children,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: ModalProps) {
    return (
        <div style={backdropStyle} role="dialog" aria-modal="true">
            <div style={{ ...boxStyle, position: 'relative' }}>
                {/* Close cross top-right */}
                <button
                    onClick={onCancel}
                    aria-label="Close"
                    style={closeButtonStyle}
                >
                    ×
                </button>
                {title && <h3 style={{ margin: '0 0 8px 0' }}>{title}</h3>}
                <div>{children}</div>
                <div style={footerStyle}>
                    <button
                        onClick={onCancel}
                        aria-label="Cancel"
                        style={{ padding: '8px 12px' }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        aria-label="Confirm"
                        style={{
                            padding: '8px 12px',
                            background: 'var(--button-color-neg)',
                            color: 'white',
                            border: 'none',
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
