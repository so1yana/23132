import './task-filter.css';
import PropTypes from 'prop-types';

export default function TaskFilter(props) {
    const { filter, changeFilter } = props;

    const handlerFilter = (value) => {
        changeFilter(value);
    };

    return (
        <ul className="filters">
            <li>
                <button className={filter === 'All' ? 'selected' : null} onClick={() => handlerFilter('All')} type="button">
                    All
                </button>
            </li>
            <li>
                <button className={filter === 'Active' ? 'selected' : null} onClick={() => handlerFilter('Active')} type="button">
                    Active
                </button>
            </li>
            <li>
                <button className={filter === 'Completed' ? 'selected' : null} onClick={() => handlerFilter('Completed')} type="button">
                    Completed
                </button>
            </li>
        </ul>
    );
}

TaskFilter.defaultProps = {
    filter: 'All',
};

TaskFilter.propTypes = {
    filter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired,
};
