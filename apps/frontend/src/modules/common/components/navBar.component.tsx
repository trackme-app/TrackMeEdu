import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavEnd,
    NavBtn,
    NavBtnLink,
} from './navComponents/nav.components';
import { type FC } from 'react';
import { useNavMenu } from '../hooks/useNavMenu.hook';
import ResponsiveLogo from '../design-system/responsiveLogo.design';
import { FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

const NavBar: FC = () => {
    const { isOpen, toggle, close } = useNavMenu();

    return (
        <>
            <Nav>
                <Bars onClick={toggle} />

                <NavMenu $isOpen={isOpen}>
                    <NavLink
                        to="/"
                        className={({ isActive }: { isActive: boolean }) =>
                            isActive ? 'active' : ''
                        }
                        onClick={close}
                    >
                        <ResponsiveLogo /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/annual"
                        className={({ isActive }: { isActive: boolean }) =>
                            isActive ? 'active' : ''
                        }
                        onClick={close}
                    >
                        Annual Report
                    </NavLink>
                    <NavLink
                        to="/team"
                        className={({ isActive }: { isActive: boolean }) =>
                            isActive ? 'active' : ''
                        }
                        onClick={close}
                    >
                        Teams
                    </NavLink>
                    <NavLink
                        to="/blogs"
                        className={({ isActive }: { isActive: boolean }) =>
                            isActive ? 'active' : ''
                        }
                        onClick={close}
                    >
                        Blogs
                    </NavLink>
                </NavMenu>
                <NavEnd>
                    <NavBtn aria-label="Settings">
                        <NavBtnLink aria-label="Settings" to="/settings" onClick={close}>
                            <FaCog aria-label="Settings" style={{ verticalAlign: 'middle' }} />
                        </NavBtnLink>
                    </NavBtn>
                    <NavBtn aria-label="Profile">
                        <NavBtnLink aria-label="Profile" to="/profile" onClick={close}>
                            <FaUser aria-label="Profile" style={{ verticalAlign: 'middle' }} />
                        </NavBtnLink>
                    </NavBtn>
                    <NavBtn aria-label="Logout">
                        <NavBtnLink aria-label="Logout" to="/logout" onClick={close}>
                            <FaSignOutAlt aria-label="Logout" style={{ verticalAlign: 'middle' }} />
                        </NavBtnLink>
                    </NavBtn>
                </NavEnd>
            </Nav>
        </>
    );
};

export default NavBar;
