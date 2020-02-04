import React, {Component} from 'react';
import {Alert, CardColumns, Col, Container, Row} from 'reactstrap';
import CarCard from "./CarCard";
import {getCars} from "../../../requests/CarsRequests";
import {connect} from "react-redux";

class CarCards extends Component {

    state = {
        cars: [],
        error: null
    };

    componentWillMount() {
        this.getCars();
    }

    getCars = () => {
        getCars()
            .then(response => {
                if (!response.errorCode)
                    this.setState({cars: response});
                else {
                    this.setError(response.message);
                }
            })
            .catch(err =>
                this.setState({error: "Ошибка. Сервер не доступен."})
            )
    };

    setError = error => {
        window.scrollTo(0, 0);
        this.setState({error: error})
    };

    render() {
        const cars = this.state.cars.map(car => {
            if (!car.busy)
                return <CarCard refresh={this.getCars} key={car.model} handleError={this.setError} car={car}/>
            return '';
        });
        return (
            <Container md="auto" style={{padding: "4rem 2rem"}}>
                <Row>
                    <Col sm="12" md={{size: 6, offset: 3}}>
                        <Alert
                            isOpen={this.state.error != null}
                            toggle={() => this.setState({error: null})}
                            color="danger">
                            {this.state.error}
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col lg>
                        <CardColumns>
                            {cars}
                        </CardColumns>
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

export default (connect(mapStateToProps)(CarCards));