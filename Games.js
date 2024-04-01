const express = require('express');
const router = express.Router();
const gamesController = require('../controller/GamesController');
const handleFileUpload = require('../middlewares/Upload')
const {checkAdminRole} = require("../middlewares/authMiddleware")

router.post('/create', checkAdminRole, handleFileUpload, gamesController.createGame);

router.get('/allGames',gamesController.getAllGames)

router.get('/recent', gamesController.getRecentGames);

router.get('/action', gamesController.getActionGames);

router.get('/adventure', gamesController.getAdventureGames);

router.get('/racing', gamesController.getRacingGames);

router.get('/fps', gamesController.getFpsGames);

router.get('/horror', gamesController.getHorrorGames);

router.get('/multiplayer', gamesController.getMultiplayerGames);

router.get('/simulator', gamesController.getSimulatorGames);

router.get('/:id',gamesController.getGameById)

// router.get('/uploads/Files/:path', gamesController.getFile);

// router.get('uploads/Files/:id', gamesController.getGameFiles);

router.put('/:id', checkAdminRole, handleFileUpload, gamesController.updateGameById)

router.delete('/:id', checkAdminRole, gamesController.deleteGameById)

module.exports = router;
