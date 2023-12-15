import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import "../App.css";

const Dashboard = () => {
    // State to hold the checklist data
    const [lists, setLists] = useState(null);

    // Token for authorization
    const token = '8db86714d15d5690af1bfae2b4f14ed9de8bd53f';

    // Navigation hook for programmatic navigation
    let navigate = useNavigate();

    // Fetching checklist data from the API
    useEffect(() => {
        axios.get('https://greenvelvet.alwaysdata.net/pfc/checklists', {
            headers: {
                token: token,
            },
        }).then((res) => {
            const response = res.data;
            setLists(response);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);

    // Function to delete an item from the checklist
    const deleteItem = async (id) => {
        try {
            await axios.get(`https://greenvelvet.alwaysdata.net/pfc/checklist/delete?id=${id}`, {
                headers: {
                    token: token,
                },
            });

            window.location.reload(false);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Function to handle delete button click
    const handleDelete = (id) => {
        const confirmation = window.confirm("Are you sure you want to delete this item?");

        if (confirmation) {
            deleteItem(id);
        }
    }

    // Function to determine the status of the checklist item
    const setStatus = (item) => {
        let stat;

        if (!item.todo.length){
            stat = "Empty";
        }
        if (item.todo.length){
            item.todo.forEach(element => {
                if (element.statut !== 1){
                    stat = "In Process";
                }
                else{
                    stat = "Done";
                }
            });
        }

        return <p>Status: {stat}</p>
    }

    // Function to calculate the number of completed tasks
    const calculateDone = (item) => {
        let amount = item.todo.reduce((acc, current) => current.statut === 1 ? acc + 1 : acc, 0)
        return amount;
    }

    // Function to display each checklist item
    const listToDiv = (item, index) => {
        return (
            <div key={index} className="resultBox" onClick={() => navigate(`/checklist/${item.id}`)}>
                <h3>{item.title}</h3>
                <p>Description: {item.description}</p>
                <p>Date: {item.created_at}</p>
                {item.todo.length ? <p>Finished: {calculateDone(item)}/{item.todo.length}</p> : null}
                {setStatus(item)}
                {/* Delete and edit buttons */}
                <button className='btn btn-primary' style={{ backgroundColor: '#26547C', border: 0 }} onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}>Delete</button>
                <button className='btn btn-secondary' onClick={(e) => { e.stopPropagation(); navigate(`/edit-checklist/${item.id}`) }}>Edit Checklist</button>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex' }}>
            {/* Aside section */}
            <aside style={{ backgroundColor: '#26547C', color: 'white', width: '25%', height: '100vh', textAlign: 'center', padding: '20px' }}>
                <Typography variant="h3">Dashboard</Typography> {/* Applying Typography */}
                <Link to="/add-checklist">
                    <button className='btn btn-primary' style={{ backgroundColor: '#FFD166', color: 'black', border: 0, width: 200 }}>NEW</button>
                </Link>
            </aside>
            {/* Main content section */}
            <div style={{ width: '75%', fontFamily: 'Roboto, sans-serif' }}> {/* Applying Roboto font family */}
                {lists ? (
                    <div style={{ padding: '20px' }}>
                        <Typography variant="h3" style={{ textAlign: 'center', marginBottom: '20px' }}>Your checklists</Typography> {/* Applying Typography */}
                        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', cursor: 'pointer' }}>
                            {Object.values(lists)[0].length === 0 ? (
                                <Typography variant="body1">Checklist is empty</Typography> 
                            ) : (
                                Object.values(lists)[0].map((item, index) => listToDiv(item, index))
                            )}
                        </div>
                    </div>
                ) : <CircularProgress />}
            </div>
        </div>
    );
}

export default Dashboard;
