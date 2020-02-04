import React, {Component} from 'react';
import {Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle} from 'reactstrap';
import {bookCar} from "../../../requests/ApplicationsRequests";
import history from '../../common/History'
import {connect} from "react-redux";

class CarCard extends Component {

    handleBooking = () => {
        if (this.props.token) {
            bookCar(this.props.token, this.props.car.id)
                .then(response => {
                    if (!response.errorCode) {
                        history.push("/profile");
                        this.props.refresh();
                    } else {
                        this.props.handleError(response.message)
                    }
                })
                .catch(err =>
                    this.setState({error: "Ошибка. Сервер не доступен."})
                )
        } else {
            history.push({
                pathname: "/login",
                state: {error: "Войдти в систему, чтобы забронировать машину"}
            })
        }
    };

    render() {
        const car = this.props.car;
        return (
            <div>
                <Card body inverse style={{backgroundColor: '#333', borderColor: '#333'}}>
                    <CardImg top width="100%" src={"data:image/png;base64, " + car.photo} alt="car photo"/>
                    <CardBody>
                        <CardTitle>{car.model}</CardTitle>
                        <CardSubtitle>Цена за минуту: {car.price} руб.</CardSubtitle>
                        <CardSubtitle>Количество мест: {car.places}</CardSubtitle>
                        <CardSubtitle>Количество дверей: {car.doors}</CardSubtitle>
                        <CardText>{car.description}</CardText>
                        <CardSubtitle>Текущий адрес: {car.currentAddress}</CardSubtitle>
                        <Button onClick={this.handleBooking} style={{marginTop: "1rem"}}
                                color="outline-warning">Бронировать</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

export default (connect(mapStateToProps)(CarCard));