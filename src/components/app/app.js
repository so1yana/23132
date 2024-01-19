import { Component } from 'react';
import Footer from '../footer';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';

import './app.css';

export default class App extends Component {
    state = {
        todos: [],
        filter: 'All',
    };

    makeItem = (label, min, sec) => {
        const id = String(label + String(Math.floor(Math.random() * 12345)));
        const normalMin = Number(min);
        const normalSec = Number(sec);
        let timer = normalMin * 60 + normalSec;
        if (Number.isNaN(timer)) timer = 0;
        return {
            id,
            checked: false,
            timer,
            label,
            created: new Date(),
            paused: true,
            interval: null,
        };
    };

    addItem = (label, min, sec) => {
        const oldArr = this.state.todos.map((el) => el);
        const newItem = this.makeItem(label, min, sec);
        const newArr = [...oldArr, newItem];

        this.setState(() => ({ todos: newArr }));
    };

    changeItem = (id, value) => {
        const oldArr = this.state.todos.map((el) => el);
        const newArr = oldArr.map((elem) => {
            if (elem.id === id) {
                if (typeof value === 'string') {
                    if (value === 'updateTime') {
                        elem.timer += 1;
                    } else if (value === 'startTimer' && !elem.checked) {
                        const interval = setInterval(() => this.updateTimer(elem.id), 1000);
                        elem.interval = interval;
                        elem.paused = false;
                    } else if (value === 'pauseTimer' && !elem.paused) {
                        clearInterval(elem.interval);
                        elem.paused = true;
                    } else elem.label = value;
                } else if (typeof value === 'boolean') elem.checked = value;
            }
            return elem;
        });

        this.setState({
            todos: newArr,
        });
    };

    setTime = (id) => {
        this.changeItem(id, 'setTime');
    };

    itemCompleted = (id, checked) => {
        this.changeItem(id, checked);
    };

    editItem = (id, text) => {
        this.changeItem(id, text);
    };

    deleteItem = (id) => {
        this.pauseTimer(id);
        this.setState(({ todos }) => {
            const itemId = todos.findIndex((el) => el.id === id);
            const newArray = [...todos.slice(0, itemId), ...todos.slice(itemId + 1)];
            return {
                todos: newArray,
            };
        });
    };

    deleteAllCheckedTasks = () => {
        const { todos } = this.state;
        const newArr = todos.filter((el) => !el.checked);

        this.setState({
            todos: newArr,
        });
    };

    filterItems = () => {
        const { todos, filter } = this.state;

        if (filter === 'All') return todos;

        return todos.filter((el) => {
            if (filter === 'Active') return !el.checked;
            return el.checked;
        });
    };

    changeFilter = (filter) => {
        this.setState({
            filter,
        });
    };

    startTimer = (id) => {
        this.changeItem(id, 'startTimer');
    };

    pauseTimer = (id) => {
        this.changeItem(id, 'pauseTimer');
    };

    updateTimer = (id) => {
        this.changeItem(id, 'updateTime');
    };

    render() {
        const itemsLeft = this.state.todos.reduce((acc, el) => (!el.checked ? ++acc : acc), 0);
        return (
            <section className="todoapp">
                <NewTaskForm addItem={this.addItem} />
                <TaskList
                    todos={this.filterItems()}
                    itemCompleted={this.itemCompleted}
                    deleteItem={this.deleteItem}
                    editItem={this.editItem}
                    setTime={this.setTime}
                    startTimer={this.startTimer}
                    pauseTimer={this.pauseTimer}
                    updateTimer={this.updateTimer}
                />
                <Footer
                    filter={this.state.filter}
                    changeFilter={this.changeFilter}
                    itemsLeft={itemsLeft}
                    deleteAllCheckedTasks={this.deleteAllCheckedTasks}
                />
            </section>
        );
    }
}
