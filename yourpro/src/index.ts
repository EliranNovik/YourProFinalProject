import express from 'express';
import cors from 'cors';
import path from 'path';
import freelancerRoutes from './routes/freelancerRoutes';
import companyRoutes from './routes/companyRoutes';
import projectRoutes from './routes/projectRoutes';

const app = express();
const port = 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/freelancers', freelancerRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/projects', projectRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Serve static files and handle React Router routes only in production
if (isProduction) {
  // Serve static files from the React build directory
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Catch-all route to handle React Router routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Mode: ${isProduction ? 'production' : 'development'}`);
}); 