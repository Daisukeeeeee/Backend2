const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../model/index');

const uploadFolder = './uploads/Files';

(async () => {
  try {
    await fs.access(uploadFolder);
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.mkdir(uploadFolder, { recursive: true });
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      console.error(err);
      throw err;
    }
  }
})();

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
});

const uploadMiddleware = upload.fields([
  { name: 'gameFile', maxCount: 1 },
  { name: 'imageUrl', maxCount: 1 },
  { name: 'screenshotFile', maxCount: 1 },
]);

const handleFileUpload = async (req, res, next) => {
  try {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: 0,
          message: 'Error uploading file',
          error: err.message,
        });
      }

      if (req.files) {
        console.log('Files uploaded successfully:', req.files);

        const gameIdToUpdate = req.params.id;

        if (gameIdToUpdate) {
          console.log('Updating existing game with ID:', gameIdToUpdate);

          const existingGame = await db.Game.findByPk(gameIdToUpdate);

          if (!existingGame) {
            return res.status(404).json({
              success: 0,
              message: 'Game not found for the given ID',
            });
          }

          if (existingGame.imageUrl) {
            const imageUrlParts = existingGame.imageUrl.split('/');
            const oldImageFilename = imageUrlParts[imageUrlParts.length - 1];
            const oldImageUrlPath = path.join(uploadFolder, oldImageFilename);

            try {
              await fs.unlink(oldImageUrlPath);
              console.log('Old image deleted successfully');
            } catch (error) {
              console.error('Error deleting old image:', error);
            }
          }

          if (existingGame.screenshotFile) {
            const screenshotFileParts = existingGame.screenshotUrl.split('/');
            const oldscreenShotFilename = screenshotFileParts[screenshotFileParts.length - 1];
            const oldScreenshotUrlPath = path.join(uploadFolder, oldscreenShotFilename);

            try {
              await fs.unlink(oldScreenshotUrlPath);
              console.log('Old screenshot deleted successfully');
            } catch (error) {
              console.error('Error deleting old screenshot:', error);
            }
          } else {
            console.log('No screenshot URL found for the existing game');
          }

          res.locals.fileDetails = {
            success: 1,
            imageUrl: req.files.imageUrl
              ? `/uploads/Files/${req.files.imageUrl[0].filename}`
              : null,
            screenshotUrl: req.files.screenshotFile
              ? `/uploads/Files/${req.files.screenshotFile[0].filename}`
              : null,
            genreId: req.body.genreId,
            filename: req.files.gameFile ? req.files.gameFile[0].filename : null,
            filePath: req.files.gameFile ? req.files.gameFile[0].path : null, 
          };
        } else {
          console.log('Creating a new game');
          console.log(req.files.gameFile[0].path)

          res.locals.fileDetails = {
            success: 1,
            imageUrl: req.files.imageUrl ? `/uploads/Files/${req.files.imageUrl[0].filename}` : null,
            screenshotUrl: req.files.screenshotFile ? `/uploads/Files/${req.files.screenshotFile[0].filename}` : null,
            genreId: req.body.genreId,
            filename: req.files.gameFile ? req.files.gameFile[0].filename : null,
            filePath: req.files.gameFile ? req.files.gameFile[0].path : null 

          };
        }
      } 
  
      next();
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({
      success: 0,
      message: 'Error handling file upload',
      error: error.message,
    });
  }
};

module.exports = handleFileUpload;
