import { type FC } from 'react';
import { HeaderFrame } from './header.frame';
import { FooterFrame } from './footer.frame';
import { Routes, Route } from 'react-router-dom';
import { Logout } from '../../auth/components/logout.component';

export const PageFrame: FC = () => {
    return (
        <>
            <HeaderFrame />
            <Routes>
                <Route path="/*" element={<div>content</div>} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
            <FooterFrame />
        </>
    );
};
