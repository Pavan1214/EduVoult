import React from 'react';
import { Link } from 'react-router-dom';

const ImageCard = ({ upload, onDelete, onEdit }) => {
  const { imageUrl, uploader, subject, group, year } = upload;

  return (
    <div className="card-wrapper">
      {/* The image itself is a link to the detail page */}
      <Link to={`/image/${upload._id}`} className="image-card-link">
        <div className="image-card">
          <img
            src={imageUrl}
            alt={subject}
            className="image-card-img"
            loading="lazy"
          />
          <div className="image-card-overlay">
            {uploader && (
              <div className="uploader-info">
                <img
                  src={uploader.profilePic}
                  alt={uploader.displayName}
                  className="uploader-avatar"
                />
                <span className="uploader-name">{uploader.displayName}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {/* The details and action buttons are in a separate container below */}
      <div className="image-card-details">
        {/* This part of the details is also a link */}
        <Link to={`/image/${upload._id}`} className="image-card-link">
          <div>
            <h3 className="card-subject">{subject}</h3>
            <p className="card-meta">{group} • {year}</p>
          </div>
        </Link>
        
        {/* Render edit/delete buttons only if the functions are provided */}
        {onDelete && onEdit && (
          <div className="card-actions">
            <button onClick={onEdit} className="card-action-btn edit-btn">Edit</button>
            <button onClick={onDelete} className="card-action-btn delete-btn">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;