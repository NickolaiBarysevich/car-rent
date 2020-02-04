import React, {Component} from 'react'
import {Alert, Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {addCar} from "../../../requests/CarsRequests";
import {connect} from "react-redux";
import '../../../style/EditCar.css'
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'

class AddCar extends Component {

    state = {
        model: null,
        description: null,
        price: null,
        doors: null,
        places: null,
        currentAddress: null,
        photo: null,
        error: null
    };

    sendRequest = (photo) => {

        const car = {
            model: this.state.model,
            description: this.state.description,
            price: this.state.price,
            doors: this.state.doors,
            places: this.state.places,
            currentAddress: this.state.currentAddress,
            photo: photo
        };

        addCar(car, this.props.token)
            .then(response => {
                if (!response.errorCode) {
                    this.props.toggle();
                    this.clearState();
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
            }).catch(err =>
            this.setState({error: "Ошибка.Сервер не доступен."})
        );
    };

    clearState = () => {
        this.setState({
            model: null,
            description: null,
            price: null,
            doors: null,
            places: null,
            currentAddress: null,
            photo: null,
            error: null
        })
    };

    handleAdd = () => {
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
                <AvForm onValidSubmit={this.handleAdd}>
                    <ModalHeader toggle={this.props.toggle}>Добавление</ModalHeader>
                    <ModalBody>
                        <Alert
                            isOpen={this.state.error != null}
                            onClose={() => this.setState({error: null})}
                            className="add-button"
                            color="danger">
                            {this.state.error}
                        </Alert>
                        <AvField
                            name="model"
                            label="Модель"
                            type="text"
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
                            <Input type="file" name="file" id="photo" onChange={this.handleImage}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="warning"
                            type="Submit"
                            disabled={!this.state.photo}>Добавить</Button>
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

export default (connect(mapStateToProps, mapDispatchToProps)(AddCar))