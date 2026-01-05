import React, { type FC } from "react";
const Copyright: FC = () => {
    const copyrightStyle: React.CSSProperties = {
        position: "fixed",
        padding: "5px",
        fontSize: 12
    }

    return (
        <div style={copyrightStyle}>
            Copyright © TrackMe Foundation 2025
        </div>
    );
};

export default Copyright;