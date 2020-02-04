import React, {Component} from 'react'
import CarView from './CarView'
import {Button} from 'reactstrap'

class Car extends Component {

    state = {
        showView: false
    };

    toggleView = () => {
        this.setState({showView: !this.state.showView});
    };

    render() {
        const car = this.props.car;
        return (
            <tr>
                <td>
                    {car.model}
                </td>
                <td>
                    {car.price}
                </td>
                <td>
                    {car.busy ? "Занята" : "Cвободна"}
                </td>
                <td>
                    {car.currentAddress}
                </td>
                <td>
                    <CarView refresh={this.props.refresh} isOpen={this.state.showView} toggle={this.toggleView}
                             car={car}/>
                    <Button
                        onClick={this.toggleView}>
                        Подробнее
                    </Button>
                </td>
            </tr>
        );
    }
}

export default Car;