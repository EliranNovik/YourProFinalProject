import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../db/config';
import { createFreelancer, getFreelancerById, updateFreelancer } from '../services/freelancerService';
import { verifyToken } from '../utils/auth';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}

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

// Register new freelancer
router.post('/register', async (req: Request, res: Response) => {
  try {
    const freelancer = await createFreelancer(req.body);
    res.status(201).json(freelancer);
  } catch (error) {
    console.error('Error registering freelancer:', error);
    res.status(500).json({ error: 'Failed to register freelancer' });
  }
});

// Get freelancer profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const freelancer = await getFreelancerById(req.params.id);
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    return res.json(freelancer);
  } catch (error) {
    console.error('Error getting freelancer:', error);
    return res.status(500).json({ error: 'Failed to get freelancer profile' });
  }
});

// Update freelancer profile
router.put('/:id', verifyToken, upload.single('profileImage'), async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }
    
    const freelancer = await updateFreelancer(req.params.id, updateData);
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    return res.json(freelancer);
  } catch (error) {
    console.error('Error updating freelancer:', error);
    return res.status(500).json({ error: 'Failed to update freelancer profile' });
  }
});

// Upload portfolio image
router.post('/:id/portfolio', verifyToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Add portfolio image to database
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO portfolio_images (freelancer_id, image_url) VALUES ($1, $2)',
        [req.params.id, imageUrl]
      );
      return res.status(201).json({ imageUrl });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error uploading portfolio image:', error);
    return res.status(500).json({ error: 'Failed to upload portfolio image' });
  }
});

export default router; 