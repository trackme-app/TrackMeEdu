import React, { type FC } from 'react';
import { useTheme } from '../design-system/themeContext';
import lightModeBackground from '../assets/day-sunny-color-icon.svg?url';
import darkModeBackground from '../assets/moon-line-icon.svg?url';

const DarkModeToggle: FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const darkModeToggleButtonStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '5px',
        right: '5px',
        width: '40px',
        height: '18px',
        borderRadius: '999px',
        backgroundColor: isDark ? '#334155' : '#e5e7eb',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 200ms ease',
        zIndex: 9999,
    };

    const darkModeToggleImgStyle: React.CSSProperties = {
        position: 'absolute',
        display: 'block',
        top: '2px',
        left: isDark ? '23px' : '3px',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        transition: 'left 200ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        objectFit: 'cover',
        pointerEvents: 'none',
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            style={darkModeToggleButtonStyle}
        >
            <img
                src={isDark ? darkModeBackground : lightModeBackground}
                alt={isDark ? 'Dark mode icon' : 'Light mode icon'}
                style={darkModeToggleImgStyle}
            />
        </button>
    );
};

export default DarkModeToggle;
