const Upload = require('../models/Upload');
const cloudinary = require('cloudinary').v2;

// @desc    Get all approved uploads
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ status: 'approved' })
      .populate('uploader', 'displayName profilePic')
      .sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single upload by ID
exports.getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id)
      .populate('uploader', 'displayName profilePic');
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    res.json(upload);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new upload
exports.createUpload = async (req, res) => {
  try {
    const { subject, group, year, semester } = req.body;
    if (!req.file) { return res.status(400).json({ msg: 'Please upload an image' }); }

    if (req.file.moderation && req.file.moderation.length > 0) {
      const moderationResponse = req.file.moderation[0];
      if (moderationResponse.status === 'rejected') {
        const highConfidenceRejection = moderationResponse.response.moderation_labels.find(
          label => label.confidence > 80.0
        );
        if (highConfidenceRejection) {
          await cloudinary.uploader.destroy(req.file.filename);
          return res.status(400).json({ message: `Upload failed: Image was flagged as inappropriate for "${highConfidenceRejection.name}".` });
        }
      }
    }

    const newUpload = new Upload({
      uploader: req.user.id,
      imageUrl: req.file.path,
      cloudinaryPublicId: req.file.filename,
      subject, group, year, semester,
      status: 'approved',
    });
    const savedUpload = await newUpload.save();
    res.status(201).json(savedUpload);
  } catch (err) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a user's own upload
exports.updateUpload = async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) { return res.status(404).json({ message: 'Upload not found' }); }
        if (upload.uploader.toString() !== req.user.id) { return res.status(401).json({ message: 'User not authorized' }); }
        
        upload.subject = req.body.subject || upload.subject;
        upload.group = req.body.group || upload.group;
        upload.year = req.body.year || upload.year;
        upload.semester = req.body.semester || upload.semester;

        const updatedUpload = await upload.save();
        res.json(updatedUpload);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a user's own upload
exports.deleteUpload = async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) { return res.status(404).json({ message: 'Upload not found' }); }
        if (upload.uploader.toString() !== req.user.id) { return res.status(401).json({ message: 'User not authorized' }); }
        
        await cloudinary.uploader.destroy(upload.cloudinaryPublicId);
        await upload.deleteOne();
        res.json({ message: 'Upload removed successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Track a download for an upload
exports.trackDownload = async (req, res) => {
  try {
    const upload = await Upload.findByIdAndUpdate(
      req.params.id, 
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (upload) {
      res.json({ downloadCount: upload.downloadCount });
    } else {
      res.status(404).json({ message: 'Upload not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};