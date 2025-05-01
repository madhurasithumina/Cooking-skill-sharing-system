import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getWorkPlan, updateWorkPlan } from '../services/api';
import './WorkPlanForm.css'; // Reuse WorkPlanForm.css

const WorkPlanEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUserId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topics: '',
    startDate: '',
    endDate: '',
    status: 'In Progress',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkPlan = async () => {
      try {
        const workPlan = await getWorkPlan(id);
        setFormData({
          title: workPlan.title,
          description: workPlan.description || '',
          topics: workPlan.topics.join(', '),
          startDate: workPlan.startDate,
          endDate: workPlan.endDate,
          status: workPlan.status,
        });
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Fetch Failed',
          text: 'Unable to load work plan.',
        });
        navigate('/workplan/list');
      }
    };
    fetchWorkPlan();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const workPlan = {
        ...formData,
        userId: currentUserId,
        topics: formData.topics.split(',').map((topic) => topic.trim()),
      };
      await updateWorkPlan(id, workPlan);
      Swal.fire({
        icon: 'success',
        title: 'Work Plan Updated!',
        text: 'Your work plan has been updated.',
        timer: 1500,
      });
      navigate('/workplan/list');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong.',
      });
      console.error('Update work plan error:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="workplan-container">
      <div className="workplan-card">
        <h2>Edit Work Plan</h2>
        <form onSubmit={handleSubmit} className="workplan-form">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title (e.g., Learn Python)"
            className="workplan-input"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="workplan-textarea"
          />
          <input
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            placeholder="Topics (comma-separated, e.g., Variables, Loops)"
            className="workplan-input"
          />
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="workplan-input"
            required
          />
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="workplan-input"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="workplan-input"
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Started">Not Started</option>
          </select>
          <button type="submit" className="workplan-submit">Update</button>
        </form>
        <button className="workplan-cancel" onClick={() => navigate('/workplan/list')}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WorkPlanEdit;