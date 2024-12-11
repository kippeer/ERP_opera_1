const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/:entity_type/:entity_id', documentController.getDocumentsByEntity);
router.put('/:id', upload.single('file'), documentController.updateDocument);

module.exports = router;