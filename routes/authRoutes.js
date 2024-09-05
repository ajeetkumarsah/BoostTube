const express = require('express');
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/register',upload.single('image'), registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
