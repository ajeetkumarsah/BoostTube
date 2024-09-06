const express = require('express');
const { updateUserProfile ,getUsers} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/me').put(protect, updateUser).delete(protect, deleteUser);
router.put('/update', updateUserProfile);
router.get('/', getUsers);
module.exports = router;
