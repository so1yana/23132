import { useMemo, useState } from 'react';
import './new-task-form.css';
import PropTypes from 'prop-types';

export default function NewTaskForm(props) {
    const initialState = useMemo(
        () => ({
            valueTask: '',
            valueMin: '',
            valueSec: '',
        }),
        [],
    );

    const [values, setValues] = useState(initialState);

    const clearValue = () => {
        setValues(initialState);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const { valueTask, valueMin, valueSec } = values;
        props.addItem(valueTask, valueMin, valueSec);
        clearValue();
        props.filterItems();
    };

    const changeValue = (event) => {
        if (event.target.placeholder === 'Min') {
            setValues((state) => ({
                ...state,
                valueMin: event.target.value,
            }));
        } else if (event.target.placeholder === 'Sec') {
            setValues((state) => ({
                ...state,
                valueSec: event.target.value,
            }));
        } else {
            setValues((state) => ({
                ...state,
                valueTask: event.target.value,
            }));
        }
    };

    const { valueTask, valueMin, valueSec } = values;

    return (
        <form className="new-todo-form" onSubmit={onSubmit}>
            <h1>Todos</h1>
            <input onChange={changeValue} value={valueTask} className="new-todo" placeholder="What needs to be done?" autoFocus />
            <input onChange={changeValue} className="new-todo-form__timer" placeholder="Min" value={valueMin} max={999} type="number" />
            <input onChange={changeValue} className="new-todo-form__timer" placeholder="Sec" value={valueSec} max={59} type="number" />
            <button type="submit" />
        </form>
    );
}

NewTaskForm.propTypes = {
    addItem: PropTypes.func.isRequired,
    filterItems: PropTypes.func.isRequired,
};
