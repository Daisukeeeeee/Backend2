const Cart = require('../model/cartModel');
const db = require('../model/index')
const Game = db.Game;
const User = db.User

const addItemToCart = async (req, res) => {
    try {
      const { userId, gameId} = req.body;
      
      const existingUser = await db.User.findByPk(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const existingGame = await db.Game.findByPk(gameId);
      if (!existingGame) {
        return res.status(404).json({ error: 'Game not found' });
      }
       
      if (!userId || !gameId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const cartItem = await Cart.create({ userId, gameId});
      res.status(201).json({ cartItem });
    } catch (error) {
      res.status(500).json({ error: 'Error adding item to cart', message: error.message });
    }
  };

  const updateCartItemQuantity = async (req, res) => {
    try {
      const id = req.params.id;
      const { quantity } = req.body;

      const cartItem = await Cart.findByPk(id);

      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      cartItem.quantity = quantity;
   
      await cartItem.save();
  
      res.json({ updatedCartItem: cartItem });
    } catch (error) {
      res.status(500).json({ error: 'Error updating cart item quantity', message: error.message });
    }
  };
  
  const removeItemFromCart = async (req, res) => {
    try {
      const id = req.params.id;
      await Cart.destroy({ where: { id: id } });
      res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error removing item from cart', message: error.message });
    }
  };
    
  const getUserCart = async (req, res) => {
    try {
      const userId = req.params.id;
      const existingUser = await db.User.findByPk(userId);
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userCart = await Cart.findAll({ where: { userId } });
  
      res.json({ userCart });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user cart', message: error.message });
    }
  };
  

module.exports = {
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  getUserCart,
};
