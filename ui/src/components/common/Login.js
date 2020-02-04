import React, {Component} from 'react';
import {Alert, Button, Col, Container, FormGroup, Label, Row} from "reactstrap";
import {connect} from "react-redux";
import {addUser} from "../../actions/AuthorizationActions";
import {AvField, AvForm, AvGroup} from 'availity-reactstrap-validation';
import {login} from "../../requests/UserRequests";
import '../../style/Login.css';

class Login extends Component {

    state = {
        username: '',
        password: '',
        error: null,
        validated: false,
        isUsernameValid: true,
        isPasswordValid: true,
    };

    handleSubmit() {
        login(this.state.username, this.state.password)
            .then(data => {
                if (data.authToken) {
                    this.props.addUser(data.username, data.authToken, data.role);
                    this.props.history.push("/")
                } else {
                    this.setState({error: data.message})
                }
            })
            .catch(err =>
                this.setState({error: "Ошибка.Сервер не доступен."})
            )
    };

    componentWillMount() {
        if (this.props.token) {
            this.props.history.push("/")
        }
    }

    componentDidMount() {
        if (this.props.history.location.state) {
            this.setState({error: this.props.history.location.state.error})
        }
    }

    componentWillUnmount() {
        this.setState({error: null})
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={6} className="login">
                        <AvForm
                            onValidSubmit={() => this.handleSubmit()}>
                            <AvGroup>
                                <Label className="login-label">Имя пользователся</Label>
                                <AvField
                                    name="Username"
                                    type="text"
                                    errorMessage="Имя пользователся должно быть от 3 до 20 символов"
                                    placeholder="Введите имя пользователя"
                                    validate={{
                                        required: {value: true},
                                        minLength: {value: 3},
                                        maxLength: {value: 20}
                                    }}
                                    onChange={event => {
                                        const username = event.target.value;
                                        this.setState({
                                            username: username,
                                            error: null,
                                            isUsernameValid: username.length >= 3 && username.length <= 30
                                        });

                                    }}
                                />
                            </AvGroup>
                            <AvGroup>
                                <Label className="login-label">Пароль</Label>
                                <AvField
                                    required
                                    name="Password"
                                    type="password"
                                    errorMessage="Пароль должен быть от 4 символов"
                                    placeholder="Введите пароль"
                                    validate={{
                                        required: {value: true},
                                        minLength: {value: 4},
                                        maxLength: {value: 30}
                                    }}
                                    onChange={event => {
                                        const password = event.target.value;
                                        this.setState({
                                            error: null,
                                            password: password,
                                            isPasswordValid: password.length >= 4 && password.length <= 30
                                        });

                                    }}

                                />
                            </AvGroup>
                            <FormGroup>
                                <Button
                                    disabled={!(this.state.isUsernameValid && this.state.isPasswordValid)}
                                    type="submit"
                                    color="warning">Подтвердить</Button>
                            </FormGroup>
                        </AvForm>
                        {
                            this.state.error
                                ? <Alert color="danger">{this.state.error}</Alert>
                                : ""
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

const mapDispatchToProps = dispatch => ({
    addUser: (username, token, role) => dispatch(addUser(username, token, role))
});

export default (connect(mapStateToProps, mapDispatchToProps)(Login));
