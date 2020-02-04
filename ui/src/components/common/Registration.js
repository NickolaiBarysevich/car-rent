import React, {Component} from 'react';
import {Alert, Card, CardBody, Col, Container, FormGroup, Input, Label, Row} from 'reactstrap'
import {AvField, AvForm, AvGroup} from 'availity-reactstrap-validation'
import Button from "reactstrap/es/Button";
import {signUp} from "../../requests/UserRequests";
import history from './History';

class Registration extends Component {

    state = {
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        passportPhoto: null,
        driverLicensePhoto: null,

        error: null,

        passportLoad: false,
        licenseLoad: false,
    };

    componentWillMount() {
        if (this.props.token)
            history.push("/")
    }

    toBase64 = async img => {
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = () => {
                let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
                if ((encoded.length % 4) > 0) {
                    encoded += '='.repeat(4 - (encoded.length % 4));
                }
                resolve(encoded);
            };
            reader.onerror = error => reject(error);
        });
    };

    handleRegistration = async () => {
        if (this.state.passportPhoto && !this.state.passportLoad)
            await this.toBase64(this.state.passportPhoto)
                .then(img => {
                    this.setState({passportPhoto: img, passportLoad: true});
                });
        if (this.state.driverLicensePhoto && !this.state.licenseLoad)
            await this.toBase64(this.state.driverLicensePhoto)
                .then(img => {
                    this.setState({driverLicensePhoto: img, licenseLoad: true})
                });
        const newUser = {
            username: this.state.username,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            passportPhoto: this.state.passportPhoto,
            driverLicensePhoto: this.state.driverLicensePhoto

        };
        signUp(newUser)
            .then(response => {
                if (!response.errorCode) {
                    history.push("/")
                } else {
                    this.setState({error: response.message});
                    window.scrollTo(0, 0);
                }
            })
            .catch(err =>
                this.setState({error: "Ошибка.Сервер не доступен."})
            )
    };

    render() {
        return (
            <Container style={{padding: "2rem 0 5rem 0"}}>
                <Row>
                    <Alert
                        isOpen={this.state.error != null}
                        toggle={() => this.setState({error: null})}
                        color="danger">
                        {this.state.error}
                    </Alert>
                </Row>
                <Row>
                    <Col sm="12" md={{size: 6, offset: 3}}>
                        <Card>
                            <CardBody>
                                <AvForm onValidSubmit={this.handleRegistration}>
                                    <AvGroup>
                                        <Label>Имя пользователя:</Label>
                                        <AvField name="username" type="text" validate={{
                                            required: {value: true, errorMessage: "Обязательное поле"},
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
                                        <Label>Пароль:</Label>
                                        <AvField name="password" type="password" validate={{
                                            required: {value: true, errorMessage: "Обязательное поле"},
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
                                            required: {value: true, errorMessage: "Обязательное поле"},
                                            match: {value: "password", errorMessage: "Пароли не совпадают"}

                                        }}
                                        />
                                    </AvGroup>
                                    <AvGroup>
                                        <Label>Имя:</Label>
                                        <AvField name="firstName" type="text" errorMessage="" validate={{
                                            required: {value: true, errorMessage: "Обязательное поле"},
                                        }}
                                                 onChange={event => {
                                                     this.setState({
                                                         firstName: event.target.value
                                                     })
                                                 }}
                                        />
                                    </AvGroup>
                                    <AvGroup>
                                        <Label>Фамилия:</Label>
                                        <AvField name="lastName" type="text" errorMessage="" validate={{
                                            required: {value: true, errorMessage: "Обязательное поле"},
                                        }}
                                                 onChange={event => {
                                                     this.setState({
                                                         lastName: event.target.value
                                                     })
                                                 }}
                                        />
                                    </AvGroup>
                                    <AvGroup>
                                        <Label>Номер телефона:</Label>
                                        <AvField name="phoneNumber" type="text" errorMessage="" validate={{
                                            required: {value: true, errorMessage: "Обязательное поле"},
                                        }}
                                                 onChange={event => {
                                                     this.setState({
                                                         phoneNumber: event.target.value
                                                     })
                                                 }}
                                        />
                                    </AvGroup>
                                    <AvGroup>
                                        <Label>Email:</Label>
                                        <AvField name="email" type="text" validate={{
                                            required: {value: true, errorMessage: "Обязательное поле"},
                                            email: {value: true, errorMessage: "Email указан неверно"}
                                        }}
                                                 onChange={event => {
                                                     this.setState({
                                                         email: event.target.value
                                                     })
                                                 }}
                                        />
                                    </AvGroup>
                                    <FormGroup>
                                        <Label for="passportPhoto">Фото паспорта:</Label>
                                        <Input type="file" name="file1" required id="photo1"
                                               onChange={e => this.setState({
                                                   passportPhoto: e.target.files[0]
                                               })}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="licensePhoto">Фото водительского удостоверения:</Label>
                                        <Input type="file" name="file2" required id="photo2"
                                               onChange={e => this.setState({
                                                   driverLicensePhoto: e.target.files[0]
                                               })}/>
                                    </FormGroup>

                                    <Button disabled={!(this.state.driverLicensePhoto && this.state.passportPhoto)}
                                            type="Submit">Зарегистрироваться</Button>
                                </AvForm>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }


}

export default Registration;