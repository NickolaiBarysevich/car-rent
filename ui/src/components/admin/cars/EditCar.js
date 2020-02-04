import React, {Component} from 'react'
import {Alert, Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {editCar} from "../../../requests/CarsRequests";
import {connect} from "react-redux";
import '../../../style/EditCar.css'
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'

class EditCar extends Component {

    state = {
        model: this.props.car.model,
        description: this.props.car.description,
        price: this.props.car.price,
        doors: this.props.car.doors,
        places: this.props.car.places,
        currentAddress: this.props.car.currentAddress,
        photo: null,
        error: null
    };

    sendRequest = (photo) => {

        const car = {
            id: this.props.car.id,
            model: this.state.model,
            description: this.state.description,
            price: this.state.price,
            doors: this.state.doors,
            places: this.state.places,
            currentAddress: this.state.currentAddress,
            photo: photo
        };

        editCar(car, this.props.token)
            .then(response => {
                if (!response.errorCode) {
                    this.props.toggle();
                    this.props.refresh();
                    this.clearState();
                    this.forceUpdate()
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
        );
    };

    clearState = () => {
        this.setState({
            model: this.props.car.model,
            description: this.props.car.description,
            price: this.props.car.price,
            doors: this.props.car.doors,
            places: this.props.car.places,
            currentAddress: this.props.car.currentAddress,
            photo: null,
            error: null
        })
    };

    handleEdit = () => {
        if (this.state.photo) {
            this.encodeImageToBase64(this.state.photo)
        } else {
            this.sendRequest(this.props.car.photo)
        }
    };

    encodeImageToBase64(img) {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => {
            const photo = reader.result.replace(/^data:(.*;base64,)?/, '');
            this.sendRequest(photo)
        };

    }

    handleImage = e => {
        this.setState({photo: e.target.files[0]})
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
                onExit={this.clearState}
            >
                <AvForm onValidSubmit={this.handleEdit}>
                    <ModalHeader toggle={this.props.toggle}>Редактирование</ModalHeader>
                    <ModalBody>
                        <Alert
                            isOpen={this.state.error != null}
                            toggle={() => this.setState({error: null})}
                            color="danger">
                            {this.state.error}
                        </Alert>
                        <AvField
                            style={{color: "black"}}
                            name="model"
                            label="Модель"
                            type="text"
                            value={this.state.model}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                            }}
                            onChange={event => {
                                const model = event.target.value;
                                this.setState({
                                    model: model,
                                });

                            }}/>
                        <AvField
                            name="description"
                            label="Описание"
                            type="textarea"
                            value={this.state.description}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                            }}
                            onChange={event => {
                                const description = event.target.value;
                                this.setState({
                                    description: description,
                                });

                            }}/>
                        <AvField
                            name="price"
                            label="Цена за минуту"
                            value={this.state.price}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                                pattern: {
                                    value: "^\\d{1,6}(\\.\\d{1,2})?$",
                                    errorMessage: "Цена должна быть положительным числом"
                                },
                            }}
                            onChange={event => {
                                const price = event.target.value;
                                this.setState({
                                    price: price,
                                });

                            }}/>
                        <AvField
                            name="doors"
                            label="Количество дверей"
                            value={this.state.doors}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                                number: {
                                    value: true,
                                    errorMessage: "Количество дверей должно быть положительным числом"
                                },
                                min: {value: 1, errorMessage: "Количество дверей должно быть положительным числом"}
                            }}
                            onChange={event => {
                                const doors = event.target.value;
                                this.setState({
                                    doors: doors,
                                });
                            }}/>
                        <AvField
                            name="places"
                            label="Количество мест"
                            value={this.state.places}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                                number: {
                                    value: true,
                                    errorMessage: "Количество мест должно быть положительным числом"
                                },
                                min: {value: 1, errorMessage: "Количество мест должно быть положительным числом"}
                            }}
                            onChange={event => {
                                const places = event.target.value;
                                this.setState({
                                    places: places,
                                });
                            }}/>
                        <AvField
                            name="address"
                            label="Текущий адрес"
                            type="text"
                            value={this.state.currentAddress}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                            }}
                            onChange={event => {
                                const address = event.target.value;
                                this.setState({
                                    currentAddress: address,
                                });

                            }}/>
                        <FormGroup>
                            <Label for="photo">Фото</Label>
                            <Input type="file" name="file" required id="photo" onChange={this.handleImage}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="warning" type="Submit">Редактировать</Button>
                        <Button color="secondary" onClick={this.props.toggle}>Отмена</Button>
                    </ModalFooter>
                </AvForm>
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

export default (connect(mapStateToProps, mapDispatchToProps)(EditCar))