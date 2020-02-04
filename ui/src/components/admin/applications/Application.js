import React, {Component} from 'react'

class Application extends Component {

    state = {
        showView: false
    };

    render() {
        const application = this.props.application;
        return (
            <tr>
                <td>
                    {application.user.lastName}
                </td>
                <td>
                    {application.car.model}
                </td>
                <td>
                    {application.rentStart ? application.rentStart : "забронировано"}
                </td>
                <td>
                    {application.rentEnd && application.rentStart ? application.rentEnd : application.rentStart ? "поездка не завершена" : "забронировано"}
                </td>
                <td>
                    {!Number.isNaN(application.totalPrice) ? application.totalPrice : application.rentStart && !application.rentEnd ? "поездка не завершена" : "забронировано"}
                </td>

            </tr>
        );
    }
}


export default Application;