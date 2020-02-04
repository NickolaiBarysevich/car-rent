import React, {Component} from 'react'
import {Alert, Button, ButtonGroup, Col, Container, Row} from 'reactstrap'
import PersonalData from './PersonalData'
import history from "../common/History";
import {connect} from "react-redux";
import CarAdministration from './cars/CarAdministration'
import CreditCardMenu from './creditCards/CreditCardMenu'

class Profile extends Component {

    state = {
        error: null,
        tab: "car"
    };

    setError = error => {
        this.setState({error: error})
    };

    componentWillMount() {
        if (!this.props.token || this.props.role !== "CLIENT")
            history.push("/")
    }

    render() {
        return (
            <Container style={{padding: "1rem 2rem "}}>
                <Row>
                    <Col md={{span: 2}}>
                        <ButtonGroup size="lg">
                            <Button active={this.state.tab === "info"}
                                    onClick={() => this.setState({tab: "info"})}>Личные данные</Button>
                            <Button active={this.state.tab === "car"}
                                    onClick={() => this.setState({tab: "car"})}>Машина</Button>
                        </ButtonGroup>
                    </Col>
                    <Col md={{span: 'auto'}}>
                        <Alert
                            style={{margin: "0"}}
                            isOpen={this.state.error != null}
                            toggle={() => this.setState({error: null})}
                            color="danger">
                            {this.state.error}
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    {
                        this.state.tab === "car"
                            ? <CarAdministration handleError={this.setError}/>
                            : <PersonalData handleError={this.setError}/>
                    }
                    {
                        this.state.tab === "info"
                            ? <CreditCardMenu handleError={this.setError}/>
                            : ""
                    }
                </Row>
            </Container>
        );
    }
}


const mapStateToProps = state => ({
    ...state.authorizationReducer
});

export default connect(mapStateToProps)(Profile)