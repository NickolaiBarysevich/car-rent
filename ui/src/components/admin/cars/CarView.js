import React, {Component} from 'react'
import {Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import {deleteCar} from "../../../requests/CarsRequests";
import {connect} from "react-redux";
import EditCar from "./EditCar"
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'

class CarView extends Component {

    state = {
        error: null,
        showEdit: false
    };

    toggleEdit = () => {
        this.setState({showEdit: !this.state.showEdit})
    };

    handleDelete = (id, token) => {
        deleteCar(id, token)
            .then(response => {
                    if (!response.errorCode) {
                        this.props.toggle();
                        this.props.refresh();
                    } else if (response.errorCode === 401 || response.errorCode === 403) {
                        this.props.logout();
                        history.push({
                            pathname: "/login",
                            state: {error: response.message}
                        })
                    } else {
                        this.setState({error: response.message})
                    }
                }
            ).catch(err =>
            this.setState({error: "Ошибка.Сервер не доступен."})
        )
    };

    render() {
        const car = this.props.car;
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>Машина</ModalHeader>
                <ModalBody>
                    <Alert
                        isOpen={this.state.error != null}
                        onClose={() => this.setState({error: null})}
                        className="add-button"
                        color="danger">
                        {this.state.error}
                    </Alert>
                    <div>
                        <img src={"data:image/png;base64, " + car.photo} alt="car photo" style={{width: "90%"}}/>
                        <p>Модель: {car.model}</p>
                        <p>Описание: {car.description}</p>
                        <p>Количество мест: {car.places}</p>
                        <p>Количество дверей: {car.doors}</p>
                        <p>Цена: {car.price}</p>
                        <p>Адрес: {car.currentAddress}</p>
                        <p>Статус: {car.busy ? "Занята" : "Cвободна"}</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <EditCar car={car} refresh={this.props.refresh} isOpen={this.state.showEdit}
                             toggle={this.toggleEdit}/>
                    <Button color="warning" onClick={this.toggleEdit}>Редактировать</Button>
                    <Button color="danger" onClick={() => this.handleDelete(car.id, this.props.token)}>Удалить</Button>
                    <Button color="secondary" onClick={this.props.toggle}>Отмена</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default (connect(mapStateToProps, mapDispatchToProps)(CarView));