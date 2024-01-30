import { useState, useEffect } from 'react';
import Footer from '../footer';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';

import './app.css';

export default function App() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('All');

    const filterItems = () => {
        setTodos((items) => {
            const newItems = items.map((el) => {
                if (filter === 'Active') {
                    if (!el.checked) el.hidden = false;
                    else el.hidden = true;
                } else if (filter === 'Completed') {
                    if (el.checked) el.hidden = false;
                    else el.hidden = true;
                } else el.hidden = false;
                return el;
            });
            return newItems;
        });
    };

    useEffect(() => {
        filterItems();
    }, [filter]);

    const makeItem = (label, min, sec) => {
        filterItems();
        const id = String(label + String(Math.floor(Math.random() * 12345)));
        const normalMin = Number(min);
        const normalSec = Number(sec);
        let timer = normalMin * 60 + normalSec;
        if (Number.isNaN(timer)) timer = 0;
        return {
            id,
            checked: false,
            timer,
            startTime: timer,
            label,
            created: new Date(),
            hidden: false,
        };
    };

    const addItem = (label, min, sec) => {
        const oldArr = todos.map((el) => el);
        const newItem = makeItem(label, min, sec);
        const newArr = [...oldArr, newItem];
        setTodos(() => newArr);
    };

    const deleteAllCheckedTasks = () => {
        const newArr = todos.filter((el) => !el.checked);

        setTodos(newArr);
    };

    const changeFilter = (value) => {
        setFilter(value);
        filterItems();
    };

    // const updateTimer = (id) => {
    //     console.log(todos);
    //     setTodos((todo) => {
    //         // console.log('setting');
    //         const newTodos = todo.map((e) => {
    //             if (e.id === id) {
    //                 if (e.timer > 0 && e.startTime > 0) e.timer -= 1;
    //                 else e.timer += 1;
    //             }
    //             // console.log('returning');
    //             return e;
    //         });
    //         return newTodos;
    //     });
    // };

    const changeItem = (id, value) => {
        const newArr = todos.map((elem) => {
            if (elem.id === id) {
                if (typeof value === 'string') {
                    elem.label = value;
                } else if (typeof value === 'boolean') elem.checked = value;
            }
            return elem;
        });
        setTodos(newArr);
    };

    const itemCompleted = (id, checked) => {
        changeItem(id, checked);
    };

    const editItem = (id, text) => {
        changeItem(id, text);
    };

    const deleteItem = (id) => {
        const newArr = todos.filter((el) => el.id !== id);
        setTodos(newArr);
    };

    const itemsLeft = todos.reduce((acc, el) => (!el.checked ? ++acc : acc), 0);
    return (
        <section className="todoapp">
            <NewTaskForm addItem={addItem} filterItems={filterItems} />
            <TaskList todos={todos} itemCompleted={itemCompleted} deleteItem={deleteItem} editItem={editItem} filterItems={filterItems} />
            <Footer
                filter={filter}
                changeFilter={changeFilter}
                itemsLeft={itemsLeft}
                deleteAllCheckedTasks={deleteAllCheckedTasks}
                filterItems={filterItems}
            />
        </section>
    );
}
