const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const protect = require('../middlewares/Protect');

router.post('/register', userController.registerUser); 
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id',userController.deleteUser);

module.exports = router;
