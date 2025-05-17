import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkPlansByUser, deleteWorkPlan } from '../services/api';
import Swal from 'sweetalert2';
import './WorkPlanList.css';

const WorkPlanList = () => {
  const navigate = useNavigate();
  const [workPlans, setWorkPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkPlans = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }
        const data = await getWorkPlansByUser(userId);
        setWorkPlans(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load work plans.');
        setLoading(false);
      }
    };

    fetchWorkPlans();
  }, [navigate]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteWorkPlan(id);
          setWorkPlans(workPlans.filter((plan) => plan.id !== id));
          Swal.fire('Deleted!', 'Your work plan has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Failed to delete work plan.', 'error');
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/workplan/edit/${id}`);
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="workplan-list-container">
      <div className="header-section">
        <h2>Your Work Plans</h2>
        <button onClick={handleProfile} className="profile-btn">
          <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Profile
        </button>
      </div>
      {workPlans.length > 0 ? (
        <div className="workplans-grid">
          {workPlans.map((plan) => (
            <div key={plan.id} className="workplan-card">
              <h4>{plan.title}</h4>
              <p>{plan.description}</p>
              <div className="workplan-actions">
                <button onClick={() => handleEdit(plan.id)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(plan.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-workplans">
          <p>No work plans yet.</p>
          <button onClick={() => navigate('/workplan/create')} className="create-btn">Create Your First Plan</button>
        </div>
      )}
    </div>
  );
};

export default WorkPlanList;