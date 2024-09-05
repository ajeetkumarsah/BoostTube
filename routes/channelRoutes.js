const express = require('express');
const {
  getChannels,
  addChannel,
  updateChannel,
  deleteChannel,
} = require('../controllers/channelController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getChannels).post(protect, addChannel);
router
  .route('/:id')
  .put(protect, updateChannel)
  .delete(protect, deleteChannel);

module.exports = router;
