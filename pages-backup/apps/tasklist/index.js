import { Button } from 'primereact/button';
import React, { useContext, useEffect, useState } from 'react';
import { TaskContext, TaskProvider } from '../../../demo/components/apps/tasklist/context/taskcontext';
import CreateTask from '../../../demo/components/apps/tasklist/CreateTask';
import TaskList from '../../../demo/components/apps/tasklist/TaskList';
import Layout from '../../../layout/layout';
function TaskListDemo() {
    const [todo, setTodo] = useState([]);
    const [completed, setCompleted] = useState([]);
    const { showDialog, tasks } = useContext(TaskContext);

    useEffect(() => {
        setTodo(tasks.filter((t) => t.completed !== true));
        setCompleted(tasks.filter((t) => t.completed));
    }, [tasks]);

    return (
        <React.Fragment>
            <div className="card">
                <div className="flex justify-content-between align-items-center mb-5">
                    <span className="text-900 text-xl font-semibold">Task List</span>
                    <Button className="p-button-outlined font-semibold" icon="pi pi-plus" label="Create Task" onClick={() => showDialog('Create Task', true)}></Button>
                </div>
                <TaskList taskList={todo} title="ToDo"></TaskList>
                <TaskList taskList={completed} title="Completed"></TaskList>
            </div>

            <CreateTask />
        </React.Fragment>
    );
}

TaskListDemo.getLayout = function getLayout(page) {
    return (
        <Layout>
            <TaskProvider>{page}</TaskProvider>
        </Layout>
    );
};

export default TaskListDemo;
