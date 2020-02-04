import React, {Component} from 'react'
import {Button, Label, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import {AvField, AvForm, AvGroup} from "availity-reactstrap-validation";
import '../../style/EndRentModal.css'

class EndRentModal extends Component {

    state = {
        address: null,
        totalPrice: null
    };

    handleEndRent = async () => {
        const totalPrice = await this.props.endRent(this.state.address);
        this.setState({totalPrice: totalPrice})
    };

    handleToggle() {
        this.props.dismiss();
        this.props.toggle();
    }

    render() {
        return (
            <Modal
                className="non-closabel-modal"
                backdrop="static"
                keyboard="false"
                isOpen={this.props.isOpen}
            >
                <AvForm onValidSubmit={() => {
                    if (this.state.totalPrice)
                        this.handleToggle();
                    else
                        this.handleEndRent()
                }}>
                    <ModalHeader toggle={this.props.toggle}>Конец поездки</ModalHeader>
                    <ModalBody>

                        {
                            !this.state.totalPrice
                                ?
                                <AvGroup>
                                    <Label>Конечный адрес:</Label>
                                    <AvField name="address" type="text" validate={{
                                        required: {value: true, errorMessage: "Обязательное поле"},
                                    }}
                                             onChange={event => {
                                                 this.setState({
                                                     address: event.target.value
                                                 })
                                             }}
                                    />
                                </AvGroup>
                                :
                                <h2>Стоимость поездки: {this.state.totalPrice} руб.</h2>
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="Submit">Подтвердить</Button>
                        {!this.state.totalPrice ?
                            <Button color="secondary" onClick={this.props.toggle}>Отмена</Button> : ""}
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}


export default EndRentModal;