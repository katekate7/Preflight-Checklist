import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Checklist from './components/Checklist';
import Form from './components/Form';
import EditForm from './components/EditForm'
import Header from './components/Header';

function App() {
  return (
    <div className='App'>
      <Header />
      <Router>
        <Routes>
          <Route exact path='/' element={ <Dashboard /> } />
          <Route path='/checklist/:id' element={ <Checklist /> } />
          <Route path="/add-checklist" element={ <Form />} />
          <Route path='/edit-checklist/:id' element={ <EditForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
