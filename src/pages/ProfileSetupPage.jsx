import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../utils/AnimatedPage';
import { updateUserProfile } from '../services/api';

const ProfileSetupPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [group, setGroup] = useState('');
  const [year, setYear] = useState('1st');
  const [profilePicFile, setProfilePicFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('displayName', displayName);
    formData.append('group', group);
    formData.append('year', year);
    if (profilePicFile) {
      formData.append('profilePic', profilePicFile);
    }

    try {
      const { data } = await updateUserProfile(formData);
      localStorage.setItem('user', JSON.stringify(data)); // Update stored user
      setUser(data);
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.error('Profile setup failed', error);
      alert('Profile setup failed. Please try again.');
    }
  };

  return (
    <AnimatedPage>
      <div className="profile-setup-container">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={(e) => setProfilePicFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="group">Group (e.g., MPC, CSE)</label>
            <input type="text" id="group" value={group} onChange={(e) => setGroup(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select id="year" value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Save and Continue</button>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default ProfileSetupPage;