import NavBar from '../components/NavBar.component';
import { type FC } from 'react';

export const HeaderFrame: FC = () => {
    const headerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--nav-color)',
        margin: 0,
        padding: 5,
    };

    return (
        <div style={headerStyle}>
            <NavBar />
        </div>
    );
};