import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import UserForm from './components/UserForm/UserForm';
import LoginForm from './components/LoginForm/LoginForm';
import UserProfile from './components/UserProfile/UserProfile';
import HomePage from './components/HomePage/HomePage';
import WorkPlanForm from './components/WorkPlanForm/WorkPlanForm';
import WorkPlanList from './components/WorkPlanList/WorkPlanList';
import WorkPlanEdit from './components/WorkPlanEdit/WorkPlanEdit';
import PostForm from './components/PostForm/PostForm';
import PostList from './components/PostList/PostList';
import PostEdit from './components/PostEdit/PostEdit';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<UserForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/workplan/create" element={<WorkPlanForm />} />
          <Route path="/workplan/list" element={<WorkPlanList />} />
          <Route path="/workplan/edit/:id" element={<WorkPlanEdit />} />
          <Route path="/post/create" element={<PostForm />} />
          <Route path="/post/list" element={<PostList />} />
          <Route path="/post/edit/:id" element={<PostEdit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;