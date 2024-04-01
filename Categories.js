const CategoriesController = require('../controller/CategoriesController');
const { checkAdminRole } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/addCategory', checkAdminRole, CategoriesController.addCategories);

router.get('/allCategory', CategoriesController.getAllCategories);


router.get('/:id', CategoriesController.getOneCategories);

router.put('/:id', checkAdminRole, CategoriesController.updateCategories);

router.delete('/:id', checkAdminRole, CategoriesController.deleteCategories); 

router.get('/:id/products', CategoriesController.getCategoriesProduct);

module.exports = router;
