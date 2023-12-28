import { Component } from 'react';
import './new-task-form.css';
import PropTypes from 'prop-types';

export default class NewTaskForm extends Component {
    static propTypes = {
        addItem: PropTypes.func.isRequired,
    };

    state = {
        valueTask: '',
        valueMin: '',
        valueSec: '',
    };

    clearValue = () => {
        this.setState({
            valueTask: '',
            valueMin: '',
            valueSec: '',
        });
    };

    onSubmit = (event) => {
        const { valueTask, valueMin, valueSec } = this.state;
        event.preventDefault();
        this.props.addItem(valueTask, valueMin, valueSec);
        this.clearValue();
    };

    changeValue = (event) => {
        if (event.target.placeholder === 'Min') {
            this.setState({ valueMin: event.target.value });
        } else if (event.target.placeholder === 'Sec') {
            this.setState({ valueSec: event.target.value });
        } else this.setState({ valueTask: event.target.value });
    };

    render() {
        const { valueTask, valueMin, valueSec } = this.state;

        return (
            <form className="new-todo-form" onSubmit={this.onSubmit}>
                <h1>Todos</h1>
                <input
                    onChange={this.changeValue}
                    value={valueTask}
                    className="new-todo"
                    placeholder="What needs to be done?"
                    autoFocus
                />
                <input
                    onChange={this.changeValue}
                    className="new-todo-form__timer"
                    placeholder="Min"
                    value={valueMin}
                    autoFocus
                />
                <input
                    onChange={this.changeValue}
                    className="new-todo-form__timer"
                    placeholder="Sec"
                    value={valueSec}
                    autoFocus
                />
                <button type="submit" />
            </form>
        );
    }
}
