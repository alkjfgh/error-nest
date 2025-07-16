import React from 'react';
import Aside from "./Aside";

const Layout = ({ children }) => {
    return (
        <div className="container">
            <article>{children}</article>
            <Aside />
        </div>
    );
};

export default Layout;