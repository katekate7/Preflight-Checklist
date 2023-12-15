import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';


const Form = (history) => {
  // Hook to enable navigation in the React app
  const navigate = useNavigate();

  // Hook to get URL parameters
  const { id } = useParams();

  // State variables to manage form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Function to add a task
  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        title: taskTitle,
        description: taskDescription,
      },
    ]);
    setTaskTitle('');
    setTaskDescription('');
  };

  // Function to delete a task
  const handleDeleteTask = (index) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");

    if (confirm){
      const updatedList = [...tasks];
      updatedList.splice(index, 1);
      setTasks(updatedList);
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Checking for empty title or description fields
    if (!title.trim() || !description.trim()){
      // Displaying an error toast if title or description is empty
      toast.error("Title and description cannot be empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Prepare data to be sent to the server
    const data = {
      title,
      description,
      todo: tasks,
    };

    // Sending data to the server using Axios
    try {
      const response = await axios.post('https://greenvelvet.alwaysdata.net/pfc/checklist/add', data, {
        headers: {
          'Content-Type': 'application/json',
          'token': '8db86714d15d5690af1bfae2b4f14ed9de8bd53f',
        },
      });

      // Log the ID of the newly created checklist
      console.log('New checklist created with ID:', response.data.id);
      // Navigate back to the Dashboard after successful submission
      navigate('/');
    } catch (error) {
      console.error('Error creating checklist:', error.message);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="form-container">
      {/* Link to Dashboard */}
      <Link to="/">
        <Button style={{ backgroundColor: '#FFD166', color: 'black', border: 0, width: 200 }} variant="secondary">Dashboard</Button>
      </Link>
      {/* Form title */}
      <h1 className="form-title">Add Checklist</h1>
      {/* Checklist form */}
      <form className="my-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Task Title:</label>
          <input type="text" className="form-control" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Task Description:</label>
          <input type="text" className="form-control" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
        </div>
        {/* Button to add a task */}
        <button type="button" style={{ backgroundColor: '#FFD166', color: 'black', border: 0 }} className="btn btn-secondary" onClick={handleAddTask}>Add Task</button>
        {/* Button to submit the checklist */}
        <button type="submit" style={{ backgroundColor: '#26547C' }} className="btn btn-primary">Save Checklist</button>
        {/* Container for displaying toasts */}
        <ToastContainer />
      </form>
      {/* Tasks container */}
      <div className='tasks-container'>
        {/* Displaying tasks */}
        {tasks.map((task, index) => (
          <div key={index} className='task-box'>
            <p>Tittle: {task.title}</p>
            <p>Description: {task.description}</p>
            {/* Button to delete a task */}
            <Button variant='danger' onClick={() => handleDeleteTask(index)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;
