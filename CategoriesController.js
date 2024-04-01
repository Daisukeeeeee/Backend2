const db = require('../model/index');
const Categories = db.Category; 
const Games = db.Genre;

const addCategories = async (req, res) => {
  try {
    const info = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      published: req.body.published ? req.body.published : false,
    };

    const categories = await Categories.create(info);
    res.status(201).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const getOneCategories = async (req, res) => {
  try {
    const id = req.params.id;
    const categories = await Categories.findOne({ where: { id: id } });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

const updateCategories = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCategories = await Categories.update(req.body, { where: { id: id } });
    res.status(200).json({ updatedCategories });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

const deleteCategories = async (req, res) => {
  try {
    const id = req.params.id;
    await Categories.destroy({ where: { id: id } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

const getCategoriesProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Categories.findOne({
      include: [
        {
          model: Games,
          as: 'games',
        },
      ],
      where: { id: id },
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category products', error: error.message });
  }
};

module.exports = {
  addCategories,
  getAllCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
  getCategoriesProduct,
};
