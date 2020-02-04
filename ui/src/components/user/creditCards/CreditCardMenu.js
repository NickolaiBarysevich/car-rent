import React, {Component} from 'react'
import {Col, Dropdown, DropdownMenu, DropdownToggle,} from 'reactstrap'
import {getCreditCards} from "../../../requests/CreditCardRequsts";
import {logout} from "../../../actions/AuthorizationActions";
import {connect} from "react-redux";
import history from "../../common/History";
import CreditCard from './CreditCard'
import Button from "reactstrap/es/Button";
import Card from "reactstrap/es/Card";
import AddCard from "./AddCard"
import DropdownItem from "reactstrap/es/DropdownItem";

class CreditCardMenu extends Component {

    state = {
        creditCards: [],
        showAddCreditCard: false,
        isDropDownOpen: false
    };

    componentWillMount() {
        this.getCreditCards();
    }

    toggleAddCreditCard = () => {
        this.setState({
            showAddCreditCard: !this.state.showAddCreditCard
        })
    };

    getCreditCards = () => {
        getCreditCards(this.props.token)
            .then(response => {
                if (!response.errorCode) {
                    this.setState({
                        creditCards: response
                    })
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

    handleError = error => {
        this.props.handleError(error);
    };

    render() {
        const creditCards = this.state.creditCards.map(creditCard =>
            <CreditCard refresh={this.getCreditCards} creditCard={creditCard} handleError={this.handleError}/>
        );
        return (
            <Col md="3" style={{padding: "2rem .5rem 4rem"}}>
                <Card>
                    <AddCard refresh={this.getCreditCards} toggle={this.toggleAddCreditCard}
                             isOpen={this.state.showAddCreditCard}/>
                    <Button onClick={this.toggleAddCreditCard} color="warning" style={{margin: "1rem"}}>Добавить
                        кредитную карту</Button>
                    <Dropdown style={{padding: "1rem "}} isOpen={this.state.isDropDownOpen} toggle={() => {
                        this.setState({
                            isDropDownOpen: !this.state.isDropDownOpen
                        })
                    }}>

                        <DropdownToggle caret>
                            Кредитные карты
                        </DropdownToggle>
                        {
                            creditCards.length > 0
                                ?
                                <DropdownMenu>
                                    {creditCards}
                                </DropdownMenu>
                                :
                                <DropdownMenu>
                                    <DropdownItem>
                                        <h4>Карты ещё не добавлены</h4>
                                    </DropdownItem>
                                </DropdownMenu>
                        }
                    </Dropdown>

                </Card>
            </Col>
        )
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardMenu);