const express = require('express');
const router = express.Router();
const { getAllUsers, resetUserPassword, deleteUser } = require('../controllers/adminUserController');
const { adminAuth } = require('../middlewares/auth');

router.get('/', adminAuth, getAllUsers);
router.post('/:userId/reset-password', adminAuth, resetUserPassword);
router.delete('/:userId', adminAuth, deleteUser);

module.exports = adminUserRoute;
