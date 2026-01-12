import { type FC } from 'react';
import { NavLink } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export const Err404: FC = () => {

    return (
        <div>
            <FaExclamationTriangle style={{ fontSize: '10rem' }} />
            <h1>Page not found</h1>
            <h2>How did I get here?</h2>
            <p>Return to <NavLink to="/">home</NavLink></p>
        </div>
    );
};