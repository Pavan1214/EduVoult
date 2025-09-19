const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String, required: true },
  group: { type: String, required: true },
  year: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  // --- New Field ---
  downloadCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Upload', UploadSchema);