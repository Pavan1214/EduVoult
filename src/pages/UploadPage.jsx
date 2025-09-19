import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../utils/AnimatedPage';
import { createUpload } from '../services/api'; // Import createUpload

const UploadPage = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    group: '',
    year: '1',
    semester: '1',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image to upload.');
      return;
    }
    setError('');

    const uploadData = new FormData();
    uploadData.append('imageFile', imageFile);
    uploadData.append('subject', formData.subject);
    uploadData.append('group', formData.group);
    uploadData.append('year', formData.year);
    uploadData.append('semester', formData.semester);

    try {
      await createUpload(uploadData);
      alert('Upload successful! It will be visible after admin approval.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  // If user is not logged in, prompt them to log in
  if (!user) {
    return (
      <AnimatedPage>
        <div className="upload-page-container">
          <h2>Please log in to upload a resource.</h2>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="upload-page-container">
        <form className="upload-form" onSubmit={handleSubmit}>
          <h2>Upload a New Resource</h2>
          {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
          <div className="form-group">
            <label htmlFor="imageFile">Image Upload</label>
            <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="group">Group Name (e.g., MPC, CSE)</label>
            <input type="text" id="group" name="group" value={formData.group} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select id="year" name="year" value={formData.year} onChange={handleChange} required>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <select id="semester" name="semester" value={formData.semester} onChange={handleChange} required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Submit for Approval</button>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default UploadPage;