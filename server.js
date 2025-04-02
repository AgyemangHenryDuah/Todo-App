import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import todoRoutes from './src/routes/todoRoutes.js';
import expressEjsLayouts from 'express-ejs-layouts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', todoRoutes);

// Error handling middleware
app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    message: 'Page Not Found',
    error: null
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error(err);

  res.status(status).render('error', {
    status,
    message,
    error: process.env.NODE_ENV === 'development' ? err : null
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});