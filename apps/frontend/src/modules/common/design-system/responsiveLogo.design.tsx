import React from 'react';
import { useTheme } from './themeContext';

export default function ResponsiveLogo() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const picStyle: React.CSSProperties = {
        height: '2em',
        maxHeight: '2.5rem',
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '1.5rem',
    };

    const colorSuffix = isDark ? 'White' : 'Black';
    const logoLarge = `TME_Logo_256_${colorSuffix}.png`;
    const logoSmall = `TME_Logo_128_${colorSuffix}.png`;

    return (
        <>
            <style>{`
                .responsive-logo-wrapper { display: inline-block; }
                .responsive-picture { display: inline-block; }
                .responsive-picture img { height: 2em; max-height: 2.5rem; width: auto; }

                @media (max-width: 767px) {
                  .responsive-picture { display: none; }
                }

                @media (min-width: 768px) {
                  .responsive-picture { display: inline-block; }
                }
            `}</style>

            <span className="responsive-logo-wrapper" aria-hidden={false}>
                <picture className="responsive-picture">
                    <source media="(min-width: 1000px)" srcSet={logoLarge} />
                    <source media="(max-width: 999px)" srcSet={logoSmall} />
                    <img src={logoSmall} alt="TME logo" style={picStyle} />
                </picture>
            </span>
        </>
    );
}
