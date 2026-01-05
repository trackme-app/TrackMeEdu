import { FaBars } from 'react-icons/fa';
import { NavLink as RouterLink, type NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';

/* Navbar container */
export const Nav = styled.nav`
    height: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 12;
    width: 100%;
    @media screen and (max-width: 768px) {
        height: 38px;
    }
`;

/* Styled NavLink */
export const NavLink = styled(RouterLink).attrs({
    className: ({ isActive }: { isActive: boolean }) =>
        isActive ? 'active' : '',
})`
    color: var(--foreground-color);
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        text-decoration: underline;
    }
`;

/* Mobile menu icon */
export const Bars = styled(FaBars)`
    display: none;
    color: #cccbcbff;

    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1rem;
        cursor: pointer;
    }
`;

/* Menu container */
export const NavMenu = styled.div<{ $isOpen?: boolean }>`
    display: flex;
    align-items: center;
    margin-right: -24px;

    @media screen and (max-width: 768px) {
        display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
        position: absolute;
        top: 38px;
        left: 0;
        right: 0;
        background: var(--background-color);
        flex-direction: column;
        align-items: flex-start;
        padding: 8px 0;
        margin-right: 0;
    }
`;

/* Button container */
export const NavBtn = styled.nav`
    display: flex;
    margin-right: 24px;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

/* Button link */
export const NavBtnLink = styled(RouterLink)<NavLinkProps>`
    border-radius: 4px;
    background: #808080;
    padding: 2px 10px;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        background: #ffffff;
        color: #808080;
    }
`;
