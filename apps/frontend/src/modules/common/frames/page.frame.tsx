import { type FC } from 'react';
import { HeaderFrame } from './header.frame';
import { FooterFrame } from './footer.frame';
import { Routes, Route } from 'react-router-dom';
import { Logout } from '../../auth/components/logout.component';
import { Err404 } from './errors/err404.frame';
import { HomeFrame } from '../../home/frames/home.frame';

export const PageFrame: FC = () => {
    return (
        <>
            <HeaderFrame />
            <div role="main" aria-label="Main Content">
                <Routes>
                    <Route path="/" element={<HomeFrame />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/*" element={<Err404 />} />
                </Routes>
            </div>
            <FooterFrame />
        </>
    );
};
