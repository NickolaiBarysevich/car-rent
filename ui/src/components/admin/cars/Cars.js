import React, {Component} from 'react'
import {Alert, Button, Col, Container, Row, Table} from 'reactstrap'
import {getCars} from "../../../requests/CarsRequests";
import Car from './Car'
import {connect} from "react-redux";
import AddCar from './AddCar'
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'

class Cars extends Component {

    state = {
        cars: [],
        showAdd: false
    };

    toggleAdd = () => {
        this.setState({showAdd: !this.state.showAdd})
    };

    componentWillMount() {
        this.refreshCars()
    }

    refreshCars = () => {
        getCars(this.props.token)
            .then(response => {
                if (!response.errorCode) {
                    this.setState({cars: response})
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.setState({error: response.message})
                }
            }).catch(err =>
            this.setState({error: "Ошибка.Сервер не доступен."})
        )
    };

    render() {
        const cars = this.state.cars.map(car =>
            <Car refresh={this.refreshCars} car={car}/>
        );
        return (

            <Container>
                <Row>
                    <Alert
                        isOpen={this.state.error != null}
                        onClose={() => this.setState({error: null})}
                        className="add-button"
                        color="danger">
                        {this.state.error}
                    </Alert>
                </Row>
                <Row>
                    <Col sm={{size: 'auto', offset: 9}}>
                        <AddCar refresh={this.refreshCars} isOpen={this.state.showAdd} toggle={this.toggleAdd}/>
                        <Button style={{margin: "1rem 0 "}} outline color="info" onClick={this.toggleAdd}>Добавить
                            машину</Button>
                    </Col>
                </Row>
                <Row>
                    <Table dark>
                        <thead>
                        <tr>
                            <td>Модель</td>
                            <td>Цена</td>
                            <td>Занятость</td>
                            <td>Адрес</td>
                            <td>Подробнее</td>
                        </tr>
                        </thead>
                        <tbody>
                        {cars}
                        </tbody>
                    </Table>

                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default (connect(mapStateToProps, mapDispatchToProps)(Cars));