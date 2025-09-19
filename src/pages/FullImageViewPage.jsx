import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUploadById, getUploads, saveUpload, unsaveUpload, trackDownload } from '../services/api';
import ImageCard from '../components/uploads/ImageCard';
import AnimatedPage from '../utils/AnimatedPage';

const FullImageViewPage = ({ user, setUser }) => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  
  const [image, setImage] = useState(null);
  const [similarImages, setSimilarImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    if (user?.savedUploads?.includes(imageId)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }

    const fetchImageData = async () => {
      try {
        setLoading(true);
        const { data: imageData } = await getUploadById(imageId);
        setImage(imageData);
        setDownloadCount(imageData.downloadCount || 0);

        const { data: allUploads } = await getUploads();
        setSimilarImages(allUploads.filter(img => img._id !== imageId).slice(0, 5));
      } catch (err) {
        setError('Could not load image details. It may have been deleted.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
  }, [imageId, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      let updatedUserSavedUploads;
      if (isSaved) {
        const { data } = await unsaveUpload(image._id);
        updatedUserSavedUploads = data;
      } else {
        const { data } = await saveUpload(image._id);
        updatedUserSavedUploads = data;
      }
      setIsSaved(!isSaved);
      
      const updatedUser = { ...user, savedUploads: updatedUserSavedUploads };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to update save status', err);
    }
  };
  
  // --- This is the updated download function ---
  const handleDownload = async () => {
    try {
      // 1. Tell the backend to increment the download count
      const { data } = await trackDownload(image._id);
      setDownloadCount(data.downloadCount);

      // 2. Modify the URL to force download
      const imageUrl = image.imageUrl;
      const parts = imageUrl.split('/upload/');
      // Inserts 'fl_attachment' into the URL
      const downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;

      // 3. Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${image.subject}-${image._id}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
      alert('Download failed. Please try again.');
    }
  };

  if (loading) {
    return <AnimatedPage><p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading image...</p></AnimatedPage>;
  }

  if (error || !image) {
    return (
      <AnimatedPage>
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h2>Image Not Found</h2>
          <p>{error || 'The image you are looking for does not exist.'}</p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="full-view-layout">
        <div className="full-view-image-wrapper">
          <img src={image.imageUrl} alt={image.subject} />
        </div>
        <div className="full-view-details">
          {image.uploader && (
            <div className="details-uploader-info">
              <img src={image.uploader.profilePic} alt={image.uploader.displayName} className="uploader-avatar" />
              <h3>{image.uploader.displayName}</h3>
            </div>
          )}
          <div className="action-buttons">
            <button onClick={handleSaveToggle}>
              {isSaved ? 'Unsave' : 'Save'}
            </button>
            <button onClick={handleDownload} className="download-button">
              Download ({downloadCount})
            </button>
          </div>
          <div className="details-info-grid">
            <div className="info-item"><h4>Subject</h4><p>{image.subject}</p></div>
            <div className="info-item"><h4>Semester</h4><p>{image.semester}</p></div>
            <div className="info-item"><h4>Group</h4><p>{image.group}</p></div>
            <div className="info-item"><h4>Year</h4><p>{image.year}</p></div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="similar-images-title">Similar Images</h2>
        <div className="homepage-grid">
          {similarImages.map(simImage => (
            <div key={simImage._id} className="grid-item">
              <ImageCard upload={simImage} />
            </div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FullImageViewPage;