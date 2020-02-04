import React, {Component} from 'react';
import {Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Container, Row} from 'reactstrap';
import {connect} from "react-redux";
import {
    endRent,
    getApplicationByUsername,
    startRent,
    toggleLock,
    unBookCar
} from "../../../requests/ApplicationsRequests";
import history from "../../common/History";
import {logout} from "../../../actions/AuthorizationActions";
import '../../../style/CarAdministration.css'
import EndRentModal from "../EndRentModal";

class CarAdministration extends Component {

    state = {
        application: null,
        showEndModal: false
    };

    toggleShowEndModal = () => {
        this.setState({showEndModal: !this.state.showEndModal})
    };

    componentWillMount() {
        this.getApplication()
    }

    dismissApplication = () => {
        this.setState({application: null})
    };

    getApplication = () => {
        getApplicationByUsername(this.props.token, this.props.username)
            .then(response => {
                if (!response.errorCode) {
                    this.setState({application: response})
                } else if (response.errorCode === 404) {
                    this.setState({application: null})
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.props.handleError(response.message)
                }
            }).catch(err =>
            this.setState({error: "Ошибка. Сервер не доступен."})
        )
    };

    handleStartRent = () => {
        startRent(this.props.token, this.state.application.car.id)
            .then(response => {
                if (!response.errorCode) {
                    this.setState({application: response})
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.props.handleError(response.message)
                }
            }).catch(err =>
            this.setState({error: "Ошибка. Сервер не доступен."})
        )
    };

    handleUnBook = () => {
        unBookCar(this.props.token, this.state.application.car.id)
            .then(response => {
                if (response.status === 200) {
                    this.setState({application: null});
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.props.handleError(response.message)
                }
            }).catch(err =>
            this.setState({error: "Ошибка. Сервер не доступен."})
        )
    };

    handleToggleLock = () => {
        toggleLock(this.props.token, this.state.application.id)
            .then(response => {
                if (!response.errorCode) {
                    this.setState({application: response})
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.props.handleError(response.message)
                }
            }).catch(err =>
            this.setState({error: "Ошибка. Сервер не доступен."})
        )
    };

    handleEndRent = async newAddress => {
        await endRent(this.props.token, this.state.application.id, newAddress)
            .then(response => {
                if (!response.errorCode) {
                    this.setState({application: response});
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.props.handleError(response.message)
                }
            })
            .catch(err =>
                this.setState({error: "Ошибка. Сервер не доступен."})
            );
        return this.state.application.totalPrice;
    };

    render() {
        return (
            <Container style={{padding: "2rem 0 4rem 0"}}>
                <Row>
                    <Col lg="10" md={{size: 6, offset: 1}}>
                        {
                            this.state.application
                                ?
                                <Card inverse style={{backgroundColor: '#333', borderColor: '#333'}}>
                                    <CardBody>
                                        <CardImg top width="60%"
                                                 src={"data:image/png;base64, " + this.state.application.car.photo}
                                                 alt="car photo"/>
                                        <CardTitle>{this.state.application.car.model}</CardTitle>
                                        <CardText>{this.state.application.car.description}</CardText>
                                        {
                                            this.state.application.rentStart
                                                ?
                                                <div>
                                                    <EndRentModal dismiss={this.dismissApplication}
                                                                  toggle={this.toggleShowEndModal}
                                                                  isOpen={this.state.showEndModal}
                                                                  endRent={this.handleEndRent}/>
                                                    <Button color="info"
                                                            onClick={this.handleToggleLock}>
                                                        {this.state.application.carLocked ? "Открыть" : "Заблокировать"}</Button>
                                                    <Button color="success" className="button-right"
                                                            onClick={this.toggleShowEndModal}> Закончить
                                                        поездку</Button>
                                                </div>
                                                :
                                                <div>
                                                    <Button color="info" onClick={this.handleStartRent}>Начать
                                                        поездку</Button>
                                                    <Button color="danger" className="button-right"
                                                            onClick={this.handleUnBook}>Отменить
                                                        бронирование</Button>
                                                </div>
                                        }
                                    </CardBody>
                                </Card>
                                :
                                <Card>
                                    <CardBody>
                                        <h2>Используемых машин нет</h2>
                                    </CardBody>
                                </Card>
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

export default connect(mapStateToProps, mapDispatchToProps)(CarAdministration);