import React, {Component} from 'react'
import UserView from './UserView'
import {Button} from 'reactstrap'
import {connect} from "react-redux";

class User extends Component {

    state = {
        showView: false
    };

    toggleView = () => {
        this.setState({showView: !this.state.showView});
    };

    render() {
        const user = this.props.user;
        return (
            <tr>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{user.username}</td>
                <td>{user.approved ? "одобрен" : "не одобрен"}</td>
                <td>
                    <UserView refresh={this.props.refresh} isOpen={this.state.showView} toggle={this.toggleView}
                              user={user}/>
                    <Button
                        onClick={this.toggleView}>
                        Подробнее
                    </Button>
                </td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({
    ...state.authorizationReducer
});


export default (connect(mapStateToProps)(User));