import React, {Component} from 'react'
import {Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {connect} from "react-redux";
import '../../../style/EditCar.css'
import {logout} from "../../../actions/AuthorizationActions";
import {addCreditCard} from "../../../requests/CreditCardRequsts";
import history from "../../common/History";

class AddCard extends Component {

    state = {
        number: '',
        firstName: null,
        lastName: null,
        expirationDate: '/',
        secretNumber: null,
        error: null
    };


    clearState = () => {
        this.setState({
            number: '',
            firstName: null,
            lastName: null,
            expirationDate: '/',
            secretNumber: null,
            error: null
        })
    };

    handleAddCreditCard = () => {
        const creditCard = {
            number: this.state.number.split(" ").join(""),
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            expirationDate: "20" + this.state.expirationDate.substring(3, 5) + "-" + this.state.expirationDate.substring(0, 2) + "-01",
            secretNumber: this.state.secretNumber,
        };
        addCreditCard(this.props.token, creditCard)
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
            this.setState({error: "Ошибка.Сервер не доступен."}))
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
                onExit={this.clearState}
            >
                <AvForm onValidSubmit={this.handleAddCreditCard}>
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
                            name="number"
                            label="Номер карты"
                            type="text"
                            value={this.state.number}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                                pattern: {
                                    value: "/[0-9]{4} {0,1}[0-9]{4} {0,1}[0-9]{4} {0,1}[0-9]{4}/",
                                    errorMessage: " "
                                },
                                minLength: {value: 19, errorMessage: " "},
                                maxLength: {value: 19, errorMessage: " "}
                            }}
                            onChange={event => {
                                const number = event.target.value.split(" ").join("");
                                const chars = number.split('');
                                let dividedNumber = '';
                                for (let i = 0; i < chars.length; i++) {
                                    if (dividedNumber.length !== 0 && (i) % 4 === 0) {
                                        dividedNumber += " "
                                    }
                                    dividedNumber += chars[i];
                                }
                                this.setState({
                                    number: dividedNumber,
                                });

                            }}/>
                        <AvField
                            name="credFirstName"
                            label="Имя"
                            type="text"
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                            }}
                            onChange={event => {
                                const firstName = event.target.value;
                                this.setState({
                                    firstName: firstName,
                                });

                            }}/>
                        <AvField
                            name="credLastName"
                            label="Фамилия"
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                            }}
                            onChange={event => {
                                const lastName = event.target.value;
                                this.setState({
                                    lastName: lastName,
                                });

                            }}/>
                        <AvField
                            name="expirationDate"
                            label="Дата окончания обсуживания"
                            value={this.state.expirationDate}
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                                minLength: {value: 5, errorMessage: " "},
                                maxLength: {value: 5, errorMessage: " "}
                            }}
                            onChange={event => {
                                let input = event.target.value;
                                input = input.split('/').join('');
                                if (input.length <= 2) {
                                    input += "/"
                                } else {
                                    let re = input.substring(0, 2);
                                    input = re + "/" + input.substring(2, 4);
                                }
                                this.setState({expirationDate: input})
                            }}/>
                        <AvField
                            name="secretNumber"
                            label="Секретный код(на обратной стороне)"
                            validate={{
                                required: {value: true, errorMessage: "Обязателное поле"},
                                minLength: {value: 3, errorMessage: " "},
                                maxLength: {value: 3, errorMessage: " "}
                            }}
                            onChange={event => {
                                const secretNumber = event.target.value;
                                this.setState({
                                    secretNumber: secretNumber,
                                });
                            }}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="warning" type="Submit">Добавить</Button>
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

export default (connect(mapStateToProps, mapDispatchToProps)(AddCard))