const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserUploads, saveUpload, unsaveUpload, getSavedUploads } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.put('/profile', protect, upload.single('profilePic'), updateUserProfile);
router.get('/my-uploads', protect, getUserUploads);

// --- New Routes ---
router.get('/saved', protect, getSavedUploads);
router.route('/save/:uploadId')
  .post(protect, saveUpload)
  .delete(protect, unsaveUpload);

module.exports = router;