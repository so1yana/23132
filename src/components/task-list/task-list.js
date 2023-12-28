import { Component, StrictMode } from 'react';
import PropTypes from 'prop-types';
import Task from '../task';
import './task-list.css';

export default class TaskList extends Component {
    static propTypes = {
        todos: PropTypes.array.isRequired,
        itemCompleted: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
        editItem: PropTypes.func.isRequired,
    };

    render() {
        const { todos, itemCompleted, deleteItem, editItem } = this.props;

        const elements = todos.map((item) => (
            <StrictMode>
                <Task
                    key={item.id}
                    time={item.timer}
                    checked={item.checked}
                    itemCompleted={itemCompleted}
                    deleteItem={deleteItem}
                    editItem={editItem}
                    {...item}
                />
            </StrictMode>
        ));

        return <ul className="todo-list">{elements}</ul>;
    }
}
