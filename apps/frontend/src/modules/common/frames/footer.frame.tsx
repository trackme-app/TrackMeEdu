import { type FC } from 'react';
import DarkModeToggle from '../components/darkModeToggle.component';
import Copyright from '../components/copyright.component';

export const FooterFrame: FC = () => {
    const footerStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--nav-color)',
        margin: 0,
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    return (
        <div role="complementary" aria-label="Footer" style={footerStyle}>
            <Copyright />
            <DarkModeToggle />
        </div>
    );
};
