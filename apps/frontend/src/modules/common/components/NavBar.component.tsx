import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavComponents/Nav.components";
import { type FC } from "react";
import { useNavMenu } from "../hooks/useNavMenu.hook";
import ResponsiveLogo from "../design-system/ResponsiveLogo.design";
import { FaSignOutAlt } from "react-icons/fa";

const NavBar: FC = () => {
    const { isOpen, toggle, close } = useNavMenu();

    return (
        <>
            <Nav>
                <Bars onClick={toggle} />

                <NavMenu $isOpen={isOpen}>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} onClick={close}>
                        <ResponsiveLogo />
                    </NavLink>
                    <NavLink to="/events" className={({ isActive }) => (isActive ? "active" : "")} onClick={close}>
                        Events
                    </NavLink>
                    <NavLink to="/annual" className={({ isActive }) => (isActive ? "active" : "")} onClick={close}>
                        Annual Report
                    </NavLink>
                    <NavLink to="/team" className={({ isActive }) => (isActive ? "active" : "")} onClick={close}>
                        Teams
                    </NavLink>
                    <NavLink to="/blogs" className={({ isActive }) => (isActive ? "active" : "")} onClick={close}>
                        Blogs
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/logout" onClick={close}>
                        <FaSignOutAlt style={{ verticalAlign: "middle" }} />
                    </NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    );
}

export default NavBar;