import { Component } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

import './task.css';

export default class Task extends Component {
    static defaultProps = {
        label: '',
    };

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        timer: PropTypes.any.isRequired,
        checked: PropTypes.bool.isRequired,
        created: PropTypes.instanceOf(Date).isRequired,
        itemCompleted: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
        editItem: PropTypes.func.isRequired,
        startTimer: PropTypes.func.isRequired,
        pauseTimer: PropTypes.func.isRequired,
        paused: PropTypes.bool.isRequired,
    };

    state = {
        editing: false,
        text: this.props.label,
        editingText: this.props.label,
    };

    handlerInput = (event) => {
        const newText = event.target.children[0].value;
        event.preventDefault();
        this.setState({
            editing: false,
            text: newText,
        });
        this.props.editItem(this.props.id, newText);
    };

    handlerEdit = (event) => {
        event.stopPropagation();
        const parent = event.target.parentElement.parentElement.className;
        if (parent === 'completed') return;
        this.setState(() => ({ editing: true }));
    };

    handlerExit = () => {
        this.setState({
            editing: false,
            editingText: this.props.label,
        });
    };

    formatDate = (date) => formatDistanceToNow(date, { includeSeconds: true, addSuffix: true });

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
        const { id, checked, created, itemCompleted, deleteItem, startTimer, pauseTimer, timer } = this.props;
        const { editing, text, editingText } = this.state;
        const formatedTime = this.formatTime(timer);
        const formatedDate = this.formatDate(created);
        if (this.state.editing) {
            document.addEventListener('click', (e) => {
                if (e.target.nodeName === 'HTML') this.handlerExit();
            });
        }

        return (
            <li className={checked ? 'completed' : editing ? 'editing' : null}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                            pauseTimer(id);
                            itemCompleted(id, !checked);
                        }}
                    />
                    <label>
                        <span className="title">{text}</span>
                        <span className="description">
                            <button
                                className="icon icon-play"
                                type="button"
                                onClick={() => {
                                    if (this.props.paused) startTimer(id);
                                }}
                            />
                            <button
                                className="icon icon-pause"
                                type="button"
                                onClick={() => {
                                    if (!this.props.paused) pauseTimer(id);
                                }}
                            />
                            <span className="time">{formatedTime}</span>
                        </span>
                        <span className="created">{`created ${formatedDate}`}</span>
                    </label>
                    <button className="icon icon-edit" onClick={(event) => this.handlerEdit(event)} type="button" />
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
                            onChange={(event) => this.setState({ editingText: event.target.value })}
                            type="text"
                            className="edit"
                            value={editingText}
                            onKeyUp={(key) => {
                                if (key.key === 'Escape') this.handlerExit();
                            }}
                            autoFocus
                        />
                    </form>
                )}
            </li>
        );
    }
}
