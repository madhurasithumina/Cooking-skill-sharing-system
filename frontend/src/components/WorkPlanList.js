import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getWorkPlansByUser, deleteWorkPlan } from '../services/api';
import './WorkPlanList.css';

const WorkPlanList = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const [workPlans, setWorkPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkPlans = async () => {
      try {
        if (!currentUserId) {
          throw new Error('No user ID');
        }
        const data = await getWorkPlansByUser(currentUserId);
        setWorkPlans(data);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Fetch Failed',
          text: 'Unable to load work plans. Please try again.',
        });
        navigate('/login');
      }
    };
    fetchWorkPlans();
  }, [navigate, currentUserId]);

  const handleEdit = (id) => {
    navigate(`/workplan/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This will delete the work plan!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      try {
        await deleteWorkPlan(id);
        setWorkPlans(workPlans.filter((plan) => plan.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Work plan deleted.',
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Something went wrong.',
        });
      }
    }
  };

  const handleBack = () => navigate('/profile');

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="workplan-list-container">
      <div className="workplan-list-card">
        <h2>Your Work Plans</h2>
        {workPlans.length === 0 ? (
          <p>No work plans found. Create one to get started!</p>
        ) : (
          <div className="workplan-list">
            {workPlans.map((plan) => (
              <div key={plan.id} className="workplan-item">
                <h3>{plan.title}</h3>
                <p><span className="label">Description:</span> {plan.description || 'No description'}</p>
                <p><span className="label">Topics:</span> {plan.topics.join(', ')}</p>
                <p><span className="label">Start Date:</span> {plan.startDate}</p>
                <p><span className="label">End Date:</span> {plan.endDate}</p>
                <p><span className="label">Status:</span> {plan.status}</p>
                <div className="workplan-item-buttons">
                  <button
                    className="workplan-item-btn edit"
                    onClick={() => handleEdit(plan.id)}
                  >
                    Update
                  </button>
                  <button
                    className="workplan-item-btn delete"
                    onClick={() => handleDelete(plan.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="workplan-list-buttons">
          <button className="workplan-list-btn back" onClick={handleBack}>
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkPlanList;