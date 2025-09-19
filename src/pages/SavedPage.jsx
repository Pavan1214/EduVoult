import React, { useState, useEffect } from 'react';
import AnimatedPage from '../utils/AnimatedPage';
import { getSavedUploads } from '../services/api';
import ImageCard from '../components/uploads/ImageCard';

const SavedPage = ({ user }) => {
  const [savedUploads, setSavedUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const { data } = await getSavedUploads();
        setSavedUploads(data);
      } catch (error) {
        console.error("Failed to fetch saved uploads", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSaved();
    }
  }, [user]);

  if (!user) {
    return <AnimatedPage><div className="profile-page-container"><h2>Please log in to view your saved images.</h2></div></AnimatedPage>;
  }
  
  if (loading) {
    return <AnimatedPage><p style={{textAlign: 'center', marginTop: '2rem'}}>Loading saved images...</p></AnimatedPage>;
  }

  return (
    <AnimatedPage>
      <div style={{padding: '1rem'}}>
        <h1 className="homepage-title">Your Saved Images</h1>
        {savedUploads.length > 0 ? (
          <div className="homepage-grid">
            {savedUploads.map(upload => (
              <div key={upload._id} className="grid-item">
                <ImageCard upload={upload} />
              </div>
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center'}}>You haven't saved any images yet.</p>
        )}
      </div>
    </AnimatedPage>
  );
};

export default SavedPage;