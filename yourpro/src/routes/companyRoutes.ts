import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { createCompany, getCompanyById, updateCompany } from '../services/companyService';
import { verifyToken } from '../utils/auth';

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Register new company
router.post('/register', async (req: Request, res: Response) => {
  try {
    const company = await createCompany(req.body);
    return res.status(201).json(company);
  } catch (error) {
    console.error('Error registering company:', error);
    return res.status(500).json({ error: 'Failed to register company' });
  }
});

// Get company profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const company = await getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    return res.json(company);
  } catch (error) {
    console.error('Error getting company:', error);
    return res.status(500).json({ error: 'Failed to get company profile' });
  }
});

// Update company profile
router.put('/:id', verifyToken, upload.single('logo'), async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }
    
    const company = await updateCompany(req.params.id, updateData);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    return res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({ error: 'Failed to update company profile' });
  }
});

export default router; 