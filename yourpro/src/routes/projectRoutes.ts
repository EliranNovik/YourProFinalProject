import express, { Request, Response } from 'express';
import { createProject, getProjectById, updateProject, listProjects } from '../services/projectService';
import { verifyToken } from '../utils/auth';

const router = express.Router();

// Create new project
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const project = await createProject(req.body);
    return res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    return res.status(500).json({ error: 'Failed to get project' });
  }
});

// Update project
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const project = await updateProject(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
});

// List projects with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters = {
      companyId: req.query.companyId as string | undefined,
      status: req.query.status as 'open' | 'in_progress' | 'completed' | 'cancelled' | undefined,
      skill: req.query.skill as string | undefined
    };
    
    const projects = await listProjects(filters);
    return res.json(projects);
  } catch (error) {
    console.error('Error listing projects:', error);
    return res.status(500).json({ error: 'Failed to list projects' });
  }
});

export default router; 