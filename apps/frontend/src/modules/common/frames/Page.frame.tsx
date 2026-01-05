import { type FC } from 'react';
import { HeaderFrame } from './Header.frame';
import { FooterFrame } from './Footer.frame';
import { Routes, Route } from 'react-router-dom';
import { Logout } from '../../auth/components/Logout.component';

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