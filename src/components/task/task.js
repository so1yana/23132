import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

import './task.css';

export default function Task(props) {
    const { id, checked, created, itemCompleted, deleteItem, startTime, label, editItem, hidden, filterItems } = props;
    const [values, setValues] = useState({
        editing: false,
        text: label,
        editingText: label,
    });
    const [paused, setPause] = useState(true);
    const [time, setTime] = useState(startTime);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!checked) {
                setTime((value) => {
                    if (startTime === 0) return value + 1;
                    if (value > 0) return value - 1;
                    return value;
                });
            }
        }, 1000);
        if (paused) clearInterval(interval);
        return () => clearInterval(interval);
    }, [time, paused]);

    const handlerInput = (event) => {
        event.preventDefault();
        const newText = event.target.children[0].value;
        setValues((state) => ({
            ...state,
            editing: false,
            text: newText,
        }));
        editItem(id, newText);
    };

    const handlerEdit = (event) => {
        event.stopPropagation();
        const parent = event.target.parentElement.parentElement.className;
        if (parent === 'completed') return;
        setValues((state) => ({
            ...state,
            editing: true,
        }));
    };

    const handlerExit = () => {
        setValues((state) => ({
            ...state,
            editing: false,
            editingText: label,
        }));
    };

    const formatDate = (date) => formatDistanceToNow(date, { includeSeconds: true, addSuffix: true });

    const formatTime = (value) => {
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;
        const resultHours = hours < 10 ? `0${hours}` : hours;
        const resultMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const resultSeconds = seconds < 10 ? `0${seconds}` : seconds;
        if (hours > 0) return `${resultHours}:${resultMinutes}:${resultSeconds}`;
        return `${resultMinutes}:${resultSeconds}`;
    };

    const { editing, text, editingText } = values;
    const formatedTime = formatTime(time);
    const formatedDate = formatDate(created);
    if (editing) {
        document.addEventListener('click', (event) => {
            if (event.target.nodeName === 'HTML') handlerExit();
        });
    }

    return (
        <li className={checked ? 'completed' : editing ? 'editing' : null} hidden={hidden}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                        setPause(true);
                        itemCompleted(id, !checked);
                        filterItems();
                    }}
                />
                <label>
                    <span className="title">{text}</span>
                    <span className="description">
                        <button
                            className="icon icon-play"
                            type="button"
                            onClick={() => {
                                if (paused) setPause(false);
                            }}
                        />
                        <button
                            className="icon icon-pause"
                            type="button"
                            onClick={() => {
                                if (!paused) setPause(true);
                            }}
                        />
                        <span className="time">{formatedTime}</span>
                    </span>
                    <span className="created">{`created ${formatedDate}`}</span>
                </label>
                <button className="icon icon-edit" onClick={(event) => handlerEdit(event)} type="button" />
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
                <form onSubmit={handlerInput}>
                    <input
                        onChange={(event) => {
                            setValues((state) => ({
                                ...state,
                                editingText: event.target.value,
                            }));
                        }}
                        type="text"
                        className="edit"
                        value={editingText}
                        onKeyUp={(key) => {
                            if (key.key === 'Escape') handlerExit();
                        }}
                        autoFocus
                    />
                </form>
            )}
        </li>
    );
}

Task.defaultProps = {
    label: '',
};

Task.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    startTime: PropTypes.number.isRequired,
    checked: PropTypes.bool.isRequired,
    hidden: PropTypes.bool.isRequired,
    created: PropTypes.instanceOf(Date).isRequired,
    itemCompleted: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    editItem: PropTypes.func.isRequired,
    filterItems: PropTypes.func.isRequired,
};
