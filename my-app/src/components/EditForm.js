import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const EditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // const successMessage = () => {
  //   toast.success("Checklist was successfully added", {
  //     position: toast.POSITION.TOP_CENTER,
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //   })
  // }

    useEffect(() => {
      axios.get(`https://greenvelvet.alwaysdata.net/pfc/checklist?id=${id}`, {
        headers: {
          token: '8db86714d15d5690af1bfae2b4f14ed9de8bd53f',
        },
      })
      .then((res) => {
        const { title, description, todo } = res.data;
        setTitle(title);
        setDescription(description);
        setTasks(todo);
      })
      .catch((error) => {
        console.error('Error fetching checklist data:', error);
      });
    }, [id]);


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

  const handleDeleteTask = (index) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");

    if (confirm){
      const updatedList = [...tasks];
      updatedList.splice(index, 1);
      setTasks(updatedList);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id: id,
      title: title,
      description,
      todo: tasks,
    };

    console.log(tasks);
    try {
      const response = await axios.post(`https://greenvelvet.alwaysdata.net/pfc/checklist/update?id=${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'token': '8db86714d15d5690af1bfae2b4f14ed9de8bd53f',
        },
      });

      console.log('New checklist created with ID:', response.data.id);
      // successMessage();
      console.log(tasks);
      navigate('/');
    } catch (error) {
      console.error('Error creating checklist:', error.message);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="form-container">
      <Link to="/">
        <Button variant="secondary">Dashboard</Button>
      </Link>
      <h1 className="form-title">Add Checklist</h1>
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
        <button type="button" className="btn btn-secondary" onClick={handleAddTask}>Add Task</button>
        <button type="submit" className="btn btn-primary">Save Checklist</button>
        {/* <ToastContainer/> */}
      </form>
      <div className='tasks-container'>
        {tasks.map((task, index) => (
          <div key={index} className='task-box'>
            <p>Tittle: {task.title}</p>
            <p>Description: {task.description}</p>
            <Button variant='danger' onClick={() => handleDeleteTask(index)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditForm;
