import { Component } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

import './task.css';

export default class Task extends Component {
    static defaultProps = {
        label: '',
        time: null,
    };

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        time: PropTypes.any,
        checked: PropTypes.bool.isRequired,
        created: PropTypes.instanceOf(Date).isRequired,
        itemCompleted: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
        editItem: PropTypes.func.isRequired,
        setTime: PropTypes.func.isRequired,
        paused: PropTypes.bool.isRequired,
        timerDirection: PropTypes.string.isRequired,
        setDirection: PropTypes.func.isRequired,
    };

    state = {
        editing: false,
        text: this.props.label,
        timer: this.props.time,
        wasPaused: this.props.paused,
        updating: false,
        timerDir: this.props.timerDirection,
    };

    componentWillUnmount() {
        const { setTime, id } = this.props;
        const { timer } = this.state;
        this.pauseTimer();
        setTime(id, timer);
        clearInterval(this.state.timerInt);
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
        const { timer, wasPaused } = this.state;
        const { setDirection, id, checked } = this.props;
        if (checked) return;
        this.setState({ updating: true });
        if (!wasPaused) {
            const timerDirection = timer === 0 ? 'up' : 'down';
            setDirection(id, timerDirection);
            this.setState({ timerDir: timerDirection });
        }
        const timerInt = setInterval(() => this.updateTime(), 1000);
        this.setState({ timerInt });
    };

    pauseTimer = () => {
        if (!this.state.updating) return;
        clearInterval(this.state.timerInt);
        this.setState({ updating: false });
        this.setState({ wasPaused: true });
    };

    updateTime = () => {
        const { timerDir } = this.state;
        if (timerDir === 'down') {
            if (this.state.timer > 0) {
                this.setState(({ timer }) => ({
                    timer: timer - 1,
                }));
            } else this.pauseTimer();
        } else if (timerDir === 'up') {
            this.setState(({ timer }) => ({
                timer: timer + 1,
            }));
        }
    };

    formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        const resultHours = hours < 10 ? `0${hours}` : hours;
        const resultMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const resultSeconds = seconds < 10 ? `0${seconds}` : seconds;
        if (hours > 0) return `${resultHours}:${resultMinutes}:${resultSeconds}`;
        return `${resultMinutes}:${resultSeconds}`;
    };

    render() {
        const { id, checked, created, itemCompleted, deleteItem } = this.props;
        const { editing, text, timer } = this.state;
        // eslint-disable-next-line max-len
        // const formatedTime = timer >= 3600000 ? format(timer, 'hh:mm:ss') : format(timer, 'mm:ss');
        const formatedTime = this.formatTime(timer);
        const formatedDate = this.formatDate(created);
        return (
            <li className={checked ? 'completed' : editing ? 'editing' : null}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                            this.pauseTimer();
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
        );
    }
}
