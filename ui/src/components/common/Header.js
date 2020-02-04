import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {logout} from "../../actions/AuthorizationActions";
import history from './History';
import {connect} from "react-redux";
import Button from "reactstrap/es/Button";
import '../../style/Header.css'

class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color="warning" light expand="md">
                    <NavbarBrand href="/">Пчёлка Майя</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        {
                            this.props.token
                                ?
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <span className="username-span">{this.props.username}</span>
                                    </NavItem>
                                    {
                                        this.props.role === "CLIENT"
                                            ? <NavItem>
                                                <NavLink onClick={() => {
                                                    history.push("/profile");
                                                    window.location.reload()
                                                }}><Button color="secondary">Личный кабинет</Button></NavLink>
                                            </NavItem>
                                            : ""
                                    }
                                    <NavItem>
                                        <NavLink onClick={() => {
                                            history.push("/");
                                            window.location.reload();
                                            this.props.logout()
                                        }}><Button color="secondary">Выход</Button></NavLink>
                                    </NavItem>
                                </Nav>
                                :
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink onClick={() => {
                                            history.push("/registration");
                                            window.location.reload()
                                        }}><Button color="secondary">Регистрация</Button></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink onClick={() => {
                                            history.push("/login");
                                            window.location.reload()
                                        }}>
                                            <Button color="secondary">Войти</Button>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                        }
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer,
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default (connect(mapStateToProps, mapDispatchToProps)(Header));
