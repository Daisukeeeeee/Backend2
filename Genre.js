const express = require('express');
const router = express.Router();
const genreController = require('../controller/GenreController');
const { checkAdminRole } = require('../middlewares/authMiddleware');

router.post('/genres', checkAdminRole, genreController.createGenre);

router.get('/getAll', genreController.getAllGenres);

router.get('/:id', genreController.getGenreById);

router.put('/:id', checkAdminRole, genreController.updateGenreById);

router.delete('/:id', checkAdminRole, genreController.deleteGenreById);

module.exports = router;
