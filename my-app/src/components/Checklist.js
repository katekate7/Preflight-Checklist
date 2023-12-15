import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Typography from '@mui/material/Typography'; 

const Checklist = () => {
    // Retrieve 'id' parameter from the URL
    const { id } = useParams();

    // State to hold checklist data
    const [task, setTask] = useState(null);

    // Token for authorization
    const token = '8db86714d15d5690af1bfae2b4f14ed9de8bd53f';

    // Fetch checklist data from the API based on the 'id' parameter
    useEffect(() => {
        axios.get(`https://greenvelvet.alwaysdata.net/pfc/checklist?id=${id}`, {
            headers: {
                token: token,
            },
        }).then((res) => {
            const response = res.data;
            setTask(response);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);

    // Function to change the status of a todo item
    const changeTodoStatus = (index) => {
        if (!task || !task.todo[index]) return;

        const updatedTask = { ...task };
        updatedTask.todo[index].statut = updatedTask.todo[index].statut === 1 ? 0 : 1;

        const dataToUpdate = {
            id: id,
            title: updatedTask.title,
            description: updatedTask.description,
            todo: updatedTask.todo,
        };

        // Update the status of the todo item via API
        axios.post(`https://greenvelvet.alwaysdata.net/pfc/checklist/update?id=${id}`, dataToUpdate, {
            headers: {
                token: token,
            },
        }).then((res) => {
            setTask(updatedTask);
        }).catch((error) => {
            console.error('Error updating todo status:', error);
        });
    };

    // Function to display individual todo items
    const todos = (object, index) => {
        return (
            <div key={index} className="resultBox" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); changeTodoStatus(index) }}>
                <h2>{object.title}</h2>
                <p>Description: {object.description}</p>
                <p>Status: {object.statut === 1 ? 'Done' : 'In Process'}</p>
            </div>
        )
    }

    // Function to display the entire checklist
    const listToDiv = () => {
        if (!task) {
            return <div>Loading...</div>;
        }
        const item = task.todo;

        return (
            <div className="resultBox" style={{ width: '75%', margin: '10px auto' }}>
                <h1 style={{ textAlign: 'center' }}>{task.title}</h1>
                <p>Description: {task.description}</p>
                {Object.values(item).map((object, index) => todos(object, index))}
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ backgroundColor: '#26547C', color: 'white', width: '25%', padding: '20px', height: '100%' }}>
                {/* Use Typography for the header */}
                <Typography variant="h3" style={{ textAlign: 'center' }}>Checklist is {id}</Typography>
                {/* Buttons for navigation */}
                <Link to="/">
                    <button className='btn btn-primary' style={{ backgroundColor: '#FFD166', color: 'black', border: 0 }}>Dashboard</button>
                </Link>
                <Link to={`/edit-checklist/${id}`}>
                    <button className='btn btn-secondary'>Edit Checklist</button>
                </Link>
            </aside>
            <div style={{ width: '75%' }}>
                {listToDiv()}
            </div>
        </div>
    )
}

export default Checklist;
