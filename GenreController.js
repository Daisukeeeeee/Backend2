const db = require('../model/index');
const Genre = db.Genre;

const createGenre = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const newGenre = await Genre.create({
      name,
      categoryId: categoryId, 
    });
    

    res.status(201).json({ message: 'Genre created successfully', genre: newGenre });
  } catch (error) {
    res.status(500).json({ message: 'Error creating genre', error: error.message });
  }
};

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json({ genres });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genres', error: error.message });
  }
};

const getGenreById = async (req, res) => {
  try {
    const id = req.params.id;
    const genre = await Genre.findByPk(id);
    
    if (genre) {
      res.status(200).json({ genre });
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genre', error: error.message });
  }
};

const updateGenreById = async (req, res) => {
  try {
    const id = req.params.id;
    const [updatedRowsCount] = await Genre.update(req.body, { where: { id: id } });

    if (updatedRowsCount > 0) {
      res.status(200).json({ message: 'Genre updated successfully' });
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating genre', error: error.message });
  }
};

const deleteGenreById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRowsCount = await Genre.destroy({ where: { id: id } });

    if (deletedRowsCount > 0) {
      res.status(200).json({ message: 'Genre deleted successfully' });
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting genre', error: error.message });
  }
};

module.exports = {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenreById,
  deleteGenreById,
};
