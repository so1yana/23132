import PropTypes from 'prop-types';
import Task from '../task';
import './task-list.css';

export default function TaskList(props) {
    const { todos, itemCompleted, deleteItem, editItem, filterItems } = props;

    const elements = todos.map((item) => (
        <Task
            key={item.id}
            time={item.timer}
            checked={item.checked}
            paused={item.paused}
            timerDirection={item.timerDirection}
            itemCompleted={itemCompleted}
            deleteItem={deleteItem}
            editItem={editItem}
            filterItems={filterItems}
            {...item}
        />
    ));

    return <ul className="todo-list">{elements}</ul>;
}

TaskList.propTypes = {
    todos: PropTypes.array.isRequired,
    itemCompleted: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    editItem: PropTypes.func.isRequired,
    filterItems: PropTypes.func.isRequired,
};
