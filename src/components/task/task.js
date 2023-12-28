import { Component, StrictMode } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import PropTypes from 'prop-types';

import './task.css';

export default class Task extends Component {
    static defaultProps = {
        label: '',
        time: null,
    };

    static propTypes = {
        id: PropTypes.number.isRequired,
        label: PropTypes.string,
        time: PropTypes.any,
        checked: PropTypes.bool.isRequired,
        created: PropTypes.instanceOf(Date).isRequired,
        itemCompleted: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
        editItem: PropTypes.func.isRequired,
    };

    state = {
        editing: false,
        text: this.props.label,
        timer: this.props.time,
        updating: false,
    };

    componentDidUpdate() {
        console.log('updating');
    }

    handlerInput = (event) => {
        event.preventDefault();
        this.setState({
            editing: false,
        });
        this.props.editItem(this.props.id, this.state.text);
    };

    handlerEdit = (event) => {
        event.stopPropagation();
        const parent = event.target.parentElement.parentElement.className;
        if (parent === 'completed') return;
        this.setState(() => ({ editing: true }));
    };

    formatDate = (date) => formatDistanceToNow(date, { includeSeconds: true, addSuffix: true });

    startTimer = () => {
        if (this.state.updating) return;
        this.setState({ updating: true });
        const timerInt = setInterval(() => this.updateTime(), 1000);
        this.setState({ timerInt });
    };

    pauseTimer = () => {
        if (!this.state.updating) return;
        clearInterval(this.state.timerInt);
        this.setState({ updating: false });
    };

    updateTime = () => {
        if (this.state.timer > 0) {
            this.setState(({ timer }) => ({
                timer: timer - 1000,
            }));
        } else this.pauseTimer();
    };

    render() {
        console.log('rendering');
        const { id, checked, created, itemCompleted, deleteItem } = this.props;
        const { editing, text, timer } = this.state;
        const formatedTime = format(timer, 'mm:ss');
        const formatedDate = this.formatDate(created);
        return (
            <StrictMode>
                <li className={checked ? 'completed' : editing ? 'editing' : null}>
                    <div className="view">
                        <input
                            className="toggle"
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                                itemCompleted(id, !checked);
                            }}
                        />
                        <label>
                            <span className="title">{text}</span>
                            <span className="description">
                                <button
                                    className="icon icon-play"
                                    type="button"
                                    onClick={this.startTimer}
                                />
                                <button
                                    className="icon icon-pause"
                                    type="button"
                                    onClick={this.pauseTimer}
                                />
                                <span className="time">{formatedTime}</span>
                            </span>
                            <span className="created">{`created ${formatedDate}`}</span>
                        </label>
                        <button
                            className="icon icon-edit"
                            onClick={(event) => this.handlerEdit(event)}
                            type="button"
                        />
                        <button
                            className="icon icon-destroy"
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteItem(id);
                            }}
                            type="button"
                        />
                    </div>
                    {editing && (
                        <form onSubmit={this.handlerInput}>
                            <input
                                onChange={(event) => this.setState({ text: event.target.value })}
                                type="text"
                                className="edit"
                                value={text}
                            />
                        </form>
                    )}
                </li>
            </StrictMode>
        );
    }
}
