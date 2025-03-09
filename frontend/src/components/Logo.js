import React from 'react'
import logo from '../assets/logo.png';

const Logo = ({ w = 100, h = 100 }) => {
    return <img src={logo} alt="Logo" width={w} height={h} />;
};

export default Logo;
