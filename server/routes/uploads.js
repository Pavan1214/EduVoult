const express = require('express');
const router = express.Router();
const { 
  createUpload, 
  getUploads, 
  getUploadById,
  updateUpload,
  deleteUpload,
  trackDownload // Import new function
} = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getUploads)
  .post(protect, upload.single('imageFile'), createUpload);

router.route('/:id')
  .get(getUploadById)
  .put(protect, updateUpload)
  .delete(protect, deleteUpload);

// --- New Route ---
router.post('/:id/download', trackDownload);

module.exports = router;