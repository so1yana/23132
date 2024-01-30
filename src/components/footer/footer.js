import PropTypes from 'prop-types';
import TaskFilter from '../task-filter/task-filter';
import './footer.css';

export default function Footer(props) {
    const { itemsLeft, changeFilter, filter, deleteAllCheckedTasks, filterItems } = props;

    return (
        <footer className="footer">
            <span className="todo-count">{`${itemsLeft} items left`}</span>
            <TaskFilter filter={filter} changeFilter={changeFilter} filterItems={filterItems} />
            <button onClick={deleteAllCheckedTasks} className="clear-completed" type="button">
                Clear completed
            </button>
        </footer>
    );
}

Footer.defaultProps = {
    itemsLeft: 0,
    filter: 'All',
};

Footer.propTypes = {
    itemsLeft: PropTypes.number,
    changeFilter: PropTypes.func.isRequired,
    filterItems: PropTypes.func.isRequired,
    filter: PropTypes.string,
    deleteAllCheckedTasks: PropTypes.func.isRequired,
};
