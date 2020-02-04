import React, {Component} from 'react'
import {Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import {approve} from "../../../requests/UserRequests";
import {connect} from "react-redux";
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'

class UserView extends Component {

    state = {
        error: null,
    };

    handleApprove = () => {
        approve(this.props.user.id, this.props.token)
            .then(response => {
                if (!response.errorCode) {
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
        )
    };

    render() {
        const user = this.props.user;
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>Пользователь</ModalHeader>
                <ModalBody>
                    <Alert
                        isOpen={this.state.error != null}
                        toggle={() => this.setState({error: null})}
                        color="danger">
                        {this.state.error}
                    </Alert>
                    <div>
                        <p>Фамилия: {user.lastName}</p>
                        <p>Имя: {user.firstName}</p>
                        <p>Имя пользователся мест: {user.username}</p>
                        <p>Номер телефона: {user.phoneNumber}</p>
                        <p>Email: {user.email}</p>
                        <p>Статус: {user.approved ? "Одобрен" : "Не одобрен"}</p>
                        <p>Роль: {user.role}</p>
                        <img src={"data:image/png;base64, " + user.passportPhoto} alt="passportPhoto"
                             style={{width: "90%"}}/>
                        <img src={"data:image/png;base64, " + user.driverLicensePhoto} alt="driverLicensePhoto"
                             style={{width: "90%"}}/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        !user.approved ?
                            <Button color="info" onClick={this.handleApprove}>Одобрить</Button>
                            : ""
                    }
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

export default (connect(mapStateToProps, mapDispatchToProps)(UserView));