const db = require('../model/index');
const fs = require('fs').promises;
const path = require('path');
const Game = db.Game;
const Genre = db.Genre

const createGame = async (req, res, next) => {
  try {
    const { name, description, price, genreId, information, operatingSystem, processor, memory, graphicCard, storage } = req.body;

    const existingGenre = await db.Genre.findByPk(genreId);

    if (!existingGenre) {
      return res.status(400).json({ message: 'Invalid genreId. Genre not found.' });
    }

    if (!req.files || !req.files.imageUrl || !req.files.screenshotFile) {
      return res.status(400).json({ message: 'Image or screenshot files are missing.' });
    }    

    const imageUrl = `http://${req.get('host')}/uploads/Files/${req.files.imageUrl[0].filename}`;
    const screenshotUrl = `http://${req.get('host')}/uploads/Files/${req.files.screenshotFile[0].filename}`;

    const game = await db.Game.create({
      name,
      description,
      price,
      genreId,
      imageUrl, 
      screenshotUrl,
      information,
      operatingSystem,
      processor,
      memory,
      graphicCard,
      storage,
      filename: res.locals.fileDetails.filename,
      filePath: res.locals.fileDetails.filePath,
    });

    res.status(201).json({ message: 'Game created successfully', game });
  } catch (error) {
    console.error('Error creating game:', error);
    return next(error);
  }
};


const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll();
    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error: error.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const id = req.params.id;
    const game = await Game.findByPk(id);

    if (game) {
      res.status(200).json({ game });
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error: error.message });
  }
};

const getGameFiles = async (req, res) => {
  try {
    const gameId = req.query.gameId; 

    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ success: 0, message: 'Game not found' });
    }

    console.log('Game ID received:', gameId);
    console.log('Game:', game.toJSON());

    const uploadDirectory = path.join(__dirname, '..', 'uploads', 'Files');
    const files = fs.readdirSync(uploadDirectory);
    console.log('All files in directory:', files);

    const gameFiles = files.filter(file => file.startsWith(`gameFile_${gameId}`));
    console.log('Filtered files:', gameFiles);

    const fileUrls = gameFiles.map(filename => ({ 
      filename,
      url: `${req.protocol}://${req.get('host')}/uploads/Files/${filename}`
    }));

    res.json({ game: game.toJSON(), files: fileUrls });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: 0, message: 'Error fetching files', error: error.message });
  }
};



const updateGameById = async (req, res) => {
  try {
    const { imageUrl, screenshotUrl, genreId } = res.locals.fileDetails || {};
    const { id } = req.params;
    const { name, description, price } = req.body;

    const existingGame = await db.Game.findByPk(id);

    if (!existingGame) {
      return res.status(404).json({
        success: 0,
        message: 'Game not found for the given ID',
      });
    }

    if (existingGame.imageUrl) {
      const imageUrlParts = existingGame.imageUrl.split('/');
      const oldImageFilename = imageUrlParts[imageUrlParts.length - 1];
      const oldImageUrlPath = path.join(__dirname, '..', 'uploads', 'Files', oldImageFilename);

      try {
        await fs.access(oldImageUrlPath, fs.constants.F_OK);
        await fs.unlink(oldImageUrlPath);
        console.log('Old image deleted successfully');
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log('Old image not found, skipping deletion');
        } else {
          console.error('Error deleting old image:', error);
        }
      }
    }

    if (existingGame.screenshotUrl) {
      const screenshotUrlParts = existingGame.screenshotUrl.split('/');
      const oldScreenshotFilename = screenshotUrlParts[screenshotUrlParts.length - 1];
      const oldScreenshotUrlPath = path.join(__dirname, '..', 'uploads', 'Files', oldScreenshotFilename);

      try {
        await fs.access(oldScreenshotUrlPath, fs.constants.F_OK);
        await fs.unlink(oldScreenshotUrlPath);
        console.log('Old screenshot deleted successfully');
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log('Old screenshot not found, skipping deletion');
        } else {
          console.error('Error deleting old screenshot:', error);
        }
      }
    }

    existingGame.name = name;
    existingGame.description = description;
    existingGame.price = price;
    existingGame.genreId = genreId;

    if (imageUrl) {
      existingGame.imageUrl = imageUrl;
    }

    if (screenshotUrl) {
      existingGame.screenshotUrl = screenshotUrl;
    }

    await existingGame.save();

    return res.status(200).json({
      success: 1,
      message: 'Game updated successfully',
      game: existingGame,
    });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({
      success: 0,
      message: 'Error updating game',
      error: error.message,
    });
  }
};


const deleteGameById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRowsCount = await Game.destroy({ where: { id: id } });

    if (deletedRowsCount > 0) {
      res.status(200).json({ message: 'Game deleted successfully' });
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting game', error: error.message });
  }
};

const getRecentGames = async (req, res) => {
  try {
    const recentGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres', 
        where: { name: 'Recently' },
      },
    });

    res.status(200).json({ games: recentGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getActionGames = async (req, res) => {
  try {
    const actionGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres', 
        where: { name: 'Action' },
      },
    });

    res.status(200).json({ games: actionGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getAdventureGames = async (req, res) => {
  try {
    const adventureGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres',
        where: { name: 'Adventure' },
      },
    });

    res.status(200).json({ games: adventureGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getHorrorGames = async (req, res) => {
  try {
    const horrorGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres', 
        where: { name: 'Horror' },
      },
    });

    res.status(200).json({ games: horrorGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getSimulatorGames = async (req, res) => {
  try {
    const simulatorGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres',
        where: { name: 'Simulator' },
      },
    });

    res.status(200).json({ games: simulatorGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getFpsGames = async (req, res) => {
  try {
    const fpsGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres',
        where: { name: 'Fps' },
      },
    });

    res.status(200).json({ games: fpsGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getMultiplayerGames = async (req, res) => {
  try {
    const multiplayerGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres', 
        where: { name: 'Multiplayer' },
      },
    });

    res.status(200).json({ games: multiplayerGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getRacingGames = async (req, res) => {
  try {
    const racingGames = await Game.findAll({
      include: {
        model: Genre,
        as: 'genres', 
        where: { name: 'Racing' },
      },
    });

    res.status(200).json({ games: racingGames });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching action games', error: error.message });
  }
};

const getFile = function(req,res){
  res.download('./uploads/Files/'+req.params.path);
}

module.exports = {
  createGame,
  getAllGames,
  getGameById,
  getGameFiles,
  updateGameById,
  deleteGameById,
  getActionGames,
  getRecentGames,
  getRacingGames,
  getAdventureGames,
  getFpsGames,
  getHorrorGames,
  getMultiplayerGames,
  getSimulatorGames,
  getFile
};