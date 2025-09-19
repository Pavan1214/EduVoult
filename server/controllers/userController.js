const User = require('../models/User');
const Upload = require('../models/Upload');

// @desc    Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.displayName = req.body.displayName || user.displayName;
      user.group = req.body.group || user.group;
      user.year = req.body.year || user.year;
      user.isProfileComplete = true;

      if (req.file) {
        user.profilePic = req.file.path;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        group: updatedUser.group,
        year: updatedUser.year,
        isProfileComplete: updatedUser.isProfileComplete,
        token: req.headers.authorization.split(' ')[1],
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged-in user's uploads
exports.getUserUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ uploader: req.user.id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- New Functions ---

// @desc    Save an upload to the user's collection
exports.saveUpload = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const uploadId = req.params.uploadId;

    if (!user.savedUploads.includes(uploadId)) {
      user.savedUploads.push(uploadId);
      await user.save();
    }
    res.json(user.savedUploads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Unsave an upload from the user's collection
exports.unsaveUpload = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const uploadId = req.params.uploadId;
    
    user.savedUploads = user.savedUploads.filter(id => id.toString() !== uploadId);
    await user.save();
    
    res.json(user.savedUploads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all of a user's saved uploads
exports.getSavedUploads = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedUploads',
      populate: { path: 'uploader', select: 'displayName profilePic' }
    });
    res.json(user.savedUploads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};