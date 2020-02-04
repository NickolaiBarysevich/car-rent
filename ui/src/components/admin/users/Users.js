import React, {Component} from 'react'
import {Alert, Button, Container, Input, InputGroup, InputGroupAddon, Row, Table} from 'reactstrap'
import {getUsers, getUsersByLastName} from "../../../requests/UserRequests";
import User from './User'
import {connect} from "react-redux";
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'

class Users extends Component {

    state = {
        users: [],
        searchField: "",
        error: null
    };

    componentWillMount() {
        this.refreshUsers()
    }

    refreshUsers = () => {
        getUsers(this.props.token)
            .then(response => {
                if (!response.errorCode)
                    this.setState({users: response});
                else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.setState({error: response.message})
                }
            })
    };

    handleSearch = () => {
        getUsersByLastName(this.state.searchField, this.props.token)
            .then(response => {
                if (!response.errorCode)
                    this.setState({users: response});
                else if (response.errorCode === 401 || response.errorCode === 403) {
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
        const users = this.state.users.map(user => {
            if (user.role === "CLIENT")
                return <User refresh={this.refreshUsers} user={user}/>;
            return "";
        });

        return (
            <Container>
                <Row>
                    <Alert
                        isOpen={this.state.error != null}
                        toggle={() => this.setState({error: null})}
                        color="danger">
                        {this.state.error}
                    </Alert>
                </Row>
                <Row>
                    <InputGroup style={{padding: "1rem 0"}}>
                        <InputGroupAddon addonType="prepend">
                            <Button onClick={this.refreshUsers}>Сбросить</Button>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="prepend">
                            Фамилия клиента
                        </InputGroupAddon>
                        <Input onChange={event => {
                            const value = event.target.value;
                            this.setState({
                                searchField: value,
                            });
                        }}/>
                        <InputGroupAddon addonType="append">
                            <Button onClick={this.handleSearch} color="success">Поиск</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Row>
                <Row>
                    <Table dark>
                        <thead>
                        <tr>
                            <td>Фамилия</td>
                            <td>Имя</td>
                            <td>Имя пользователя</td>
                            <td>Статус</td>
                            <td>Подробнее</td>
                        </tr>
                        </thead>
                        <tbody>
                        {users}
                        </tbody>
                    </Table>

                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default (connect(mapStateToProps, mapDispatchToProps)(Users));