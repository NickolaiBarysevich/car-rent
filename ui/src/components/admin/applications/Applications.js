import React, {Component} from 'react'
import {Button, Container, Input, InputGroup, InputGroupAddon, Row, Table} from 'reactstrap'
import {getApplications, getApplicationsByLastName} from "../../../requests/ApplicationsRequests";
import Application from './Application'
import {connect} from "react-redux";
import {logout} from "../../../actions/AuthorizationActions";
import history from '../../common/History'

class Applications extends Component {

    state = {
        applications: [],
        searchField: ""
    };

    componentWillMount() {
        this.getApplications();
    }

    getApplications = () => {
        getApplications(this.props.token)
            .then(response => {
                if (!response.errorCode)
                    this.setState({applications: response});
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
        getApplicationsByLastName(this.props.token, this.state.searchField)
            .then(response => {
                if (!response.errorCode)
                    this.setState({applications: response});
                else if (response.errorCode === 401 || response.errorCode === 403) {
                    this.props.logout();
                    this.props.history.push({
                        pathname: "/login",
                        state: {error: response.message}
                    })
                } else {
                    this.setState({error: response.message})
                }
            })
    };

    render() {
        const applications = this.state.applications.map(application =>
            <Application application={application}/>
        );
        return (

            <Container style={{padding: "0 0 4rem 0"}}>
                <Row>
                    <InputGroup style={{padding: "1rem 0"}}>
                        <InputGroupAddon addonType="prepend">
                            <Button onClick={this.getApplications}>Сбросить</Button>
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
                            <Button color="success" onClick={this.handleSearch}>Поиск</Button>

                        </InputGroupAddon>
                    </InputGroup>
                </Row>
                <Row>
                    <Table dark>
                        <thead>
                        <tr>
                            <td>Фамилия клиента</td>
                            <td>Модель машины</td>
                            <td>Начало поезлки</td>
                            <td>Конец поездки</td>
                            <td>Итоговая цена</td>
                        </tr>
                        </thead>
                        <tbody>
                        {applications}
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

export default (connect(mapStateToProps, mapDispatchToProps)(Applications));