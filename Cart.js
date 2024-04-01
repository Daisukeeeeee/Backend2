const express = require('express');
const cartController = require('../controller/cart.controller');
const router = express.Router();

router.post('/add', cartController.addItemToCart);
router.put('/:id', cartController.updateCartItemQuantity);
router.delete('/:id', cartController.removeItemFromCart);
router.get('/:id', cartController.getUserCart);

module.exports = router;
 