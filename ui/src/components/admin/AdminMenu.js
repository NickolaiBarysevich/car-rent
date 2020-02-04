import React, {Component} from 'react'
import {Button, ButtonGroup, Col, Container, Row} from 'reactstrap'
import Cars from './cars/Cars'
import Applications from "./applications/Applications";
import Users from "./users/Users";

class AdminMenu extends Component {

    state = {
        tab: "cars"
    };

    render() {
        return (
            <Container style={{padding: "1rem 0 "}}>
                <Row>
                    <Col>
                        <ButtonGroup size="lg">
                            <Button active={this.state.tab === "cars"}
                                    onClick={() => this.setState({tab: "cars"})}>Машины</Button>
                            <Button active={this.state.tab === "applications"}
                                    onClick={() => this.setState({tab: "applications"})}>Заказы</Button>
                            <Button active={this.state.tab === "users"}
                                    onClick={() => this.setState({tab: "users"})}>Пользователи</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    {
                        this.state.tab === "cars"
                            ? <Cars/>
                            : this.state.tab === "applications"
                            ? <Applications/>
                            : <Users/>
                    }
                </Row>
            </Container>
        )
    }
}

export default AdminMenu;