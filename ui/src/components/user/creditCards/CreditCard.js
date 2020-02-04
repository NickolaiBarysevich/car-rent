import React, {Component} from 'react'
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle, DropdownItem} from 'reactstrap'
import {deleteCard, makeMain} from "../../../requests/CreditCardRequsts";
import {connect} from "react-redux";
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'
import '../../../style/CreditCardMenu.css'

class CreditCard extends Component {

    handleDelete = () => {
        deleteCard(this.props.token, this.props.creditCard.id)
            .then(response => {
                if (response.status === 200) {
                    this.props.refresh();
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push("/")
                } else {
                    this.props.handleError(response.message);
                }
            })
            .catch(err => {
                this.props.handleError("Ошибка. Сервер не доступен")
            })
    };

    handleMakeMain = () => {
        makeMain(this.props.token, this.props.creditCard.id)
            .then(response => {
                if (!response.errorCode) {
                    this.props.refresh();
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push("/")
                } else {
                    this.props.handleError(response.message);
                }
            })
            .catch(err => {
                this.props.handleError("Ошибка. Сервер не доступен")
            })
    };

    render() {
        const creditCard = this.props.creditCard;
        return (
            <DropdownItem className="dropdown-item" toggle={false}>
                <Card style={{borderRadius: "1rem", minWidth: "6rem"}}>
                    <CardBody>
                        <CardTitle>Номер: **** {creditCard.number.substring(12, 16)}</CardTitle>
                        <CardSubtitle>{creditCard.firstName + " " + creditCard.lastName}</CardSubtitle>
                        <ButtonGroup>
                            {
                                !creditCard.main
                                    ?
                                    <Button outline color="info" onClick={this.handleMakeMain}>Сделать основной</Button>
                                    :
                                    ""
                            }
                            <Button outline color="danger" onClick={this.handleDelete}>Удалить</Button>
                        </ButtonGroup>
                    </CardBody>
                </Card>
            </DropdownItem>
        )
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard);