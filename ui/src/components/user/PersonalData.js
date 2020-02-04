import React, {Component} from 'react'
import {Button, Card, CardBody, Col, Label} from 'reactstrap'
import {AvField, AvForm, AvGroup} from "availity-reactstrap-validation";
import {getUserInfo, updateUser} from "../../requests/UserRequests";
import {connect} from "react-redux";
import {addUser, logout} from "../../actions/AuthorizationActions";
import history from "../common/History";

class PersonalData extends Component {

    state = {
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,

    };

    componentWillMount() {
        this.getUserInfo();
    }

    getUserInfo = (token) => {
        getUserInfo(token ? token : this.props.token)
            .then(response => {
                if (!response.errorCode) {
                    this.setState({
                        username: response.username,
                        password: response.password,
                        firstName: response.firstName,
                        lastName: response.lastName,
                        phoneNumber: response.phoneNumber,
                        email: response.email,
                    })
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.props.handleError(response.message)
                }
            })
            .catch(err =>
                this.props.handleError({error: "Ошибка.Сервер не доступен."})
            )
    };

    handleUpdate = () => {
        const newUser = {
            username: this.state.username,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
        };
        updateUser(this.props.token, newUser)
            .then(response => {
                if (!response.errorCode) {
                    this.props.addUser(response.username, response.authToken, response.role);
                    this.setState({
                        password: ''
                    });
                    this.getUserInfo(response.authToken);
                } else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.props.handleError(response.message)
                }
            })
            .catch(err =>
                this.props.handleError({error: "Ошибка.Сервер не доступен."})
            )
    };

    render() {
        return (
            <Col md={{size: 6, offset: 2}} style={{padding: "2rem 0 4rem 0"}}>
                <Card>
                    <CardBody>
                        <AvForm onValidSubmit={this.handleUpdate}>
                            <AvGroup>
                                <Label>Имя пользователя:</Label>
                                <AvField name="username" type="text" value={this.state.username} validate={{
                                    minLength: {
                                        value: 3,
                                        errorMessage: "Имя пользователя не должно быть меньше 3 символов"
                                    },
                                    maxLength: {
                                        value: 20,
                                        errorMessage: "Имя пользователя не должно быть больше 20 символов"
                                    }
                                }}
                                         onChange={event => {
                                             this.setState({
                                                 username: event.target.value
                                             })
                                         }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label>Новый пароль:</Label>
                                <AvField name="password" type="password" value={this.state.password} validate={{
                                    minLength: {
                                        value: 4,
                                        errorMessage: "Пароль не должен быть меньше 4 символов"
                                    },
                                    maxLength: {
                                        value: 20,
                                        errorMessage: "Пароль не должен быть больше 20 символов"
                                    },
                                }}
                                         onChange={event => {
                                             this.setState({
                                                 password: event.target.value
                                             })
                                         }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label>Повторите пароль:</Label>
                                <AvField name="passwordRep" type="password" validate={{
                                    required: {
                                        value: !!this.state.password && this.state.password.length > 0,
                                        errorMessage: "Пароли не совпадают"
                                    },
                                    match: {value: "password", errorMessage: "Пароли не совпадают"}
                                }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label>Имя:</Label>
                                <AvField name="firstName" type="text" value={this.state.firstName}
                                         onChange={event => {
                                             this.setState({
                                                 firstName: event.target.value
                                             })
                                         }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label>Фамилия:</Label>
                                <AvField name="lastName" type="text" value={this.state.lastName}
                                         onChange={event => {
                                             this.setState({
                                                 lastName: event.target.value
                                             })
                                         }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label>Номер телефона:</Label>
                                <AvField name="phoneNumber" type="text" value={this.state.phoneNumber}
                                         onChange={event => {
                                             this.setState({
                                                 phoneNumber: event.target.value
                                             })
                                         }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label>Email:</Label>
                                <AvField name="email" type="text" value={this.state.email} validate={{
                                    email: {value: true, errorMessage: "Email указан неверно"}
                                }}
                                         onChange={event => {
                                             this.setState({
                                                 email: event.target.value
                                             })
                                         }}
                                />
                            </AvGroup>
                            <Button color="warning" type="Submit">Сохранить</Button>
                        </AvForm>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

const mapDispatchToProps = dispatch => ({
    addUser: (username, token, role) => dispatch(addUser(username, token, role)),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalData)