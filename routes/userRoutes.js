const express = require('express');
const {getUserById, updateUserProfile ,getUsers} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/me').get(protect,getUserById);
router.put('/update', updateUserProfile);
router.get('/', getUsers);
module.exports = router;
