import React from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';

const Footer = () => (
    <Navbar
        color="warning"
        light
        fixed="bottom"
        expand="lg">
        <NavbarBrand
            className="mx-auto"
            href="#home">
            Пчёлка Майя
        </NavbarBrand>
    </Navbar>
);

export default Footer;