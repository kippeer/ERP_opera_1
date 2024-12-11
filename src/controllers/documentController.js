const Document = require('../models/Document');
const ActivityLog = require('../models/ActivityLog');
const path = require('path');
const fs = require('fs').promises;

exports.uploadDocument = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = await Document.create({
      ...req.body,
      file_path: file.path,
      file_type: path.extname(file.originalname),
      file_size: file.size
    });

    await ActivityLog.create({
      entity_type: req.body.entity_type,
      entity_id: req.body.entity_id,
      activity_type: 'note',
      description: `New document uploaded: ${document.title}`,
      performed_by: req.body.uploaded_by || 1
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDocumentsByEntity = async (req, res) => {
  try {
    const { entity_type, entity_id } = req.params;
    const documents = await Document.findAll({
      where: { entity_type, entity_id }
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByPk(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (req.file) {
      // Delete old file
      await fs.unlink(document.file_path);
      
      // Update with new file info
      await document.update({
        ...req.body,
        file_path: req.file.path,
        file_type: path.extname(req.file.originalname),
        file_size: req.file.size,
        version: document.version + 1
      });
    } else {
      await document.update(req.body);
    }

    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};