import express from 'express';
import {
  createGrievance,
  getAllGrievances,
  getGrievanceById,
  voteGrievance,
  updateGrievance   // ✅ ADD THIS
} from '../controllers/grievanceController.js';

import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/grievances
// @desc    Create a new grievance
// @access  Private
router.post('/', auth, createGrievance);

// @route   GET /api/grievances
// @desc    Get all grievances
// @access  Public
router.get('/', getAllGrievances);

// @route   GET /api/grievances/:id
// @desc    Get a single grievance by ID
// @access  Public
router.get('/:id', getGrievanceById);

// @route   POST /api/grievances/:id/vote
// @desc    Vote on a grievance
// @access  Private
router.post('/:id/vote', auth, voteGrievance);

// 🔥 NEW ROUTE
// @route   PUT /api/grievances/:id
// @desc    Update grievance (status, title, description)
// @access  Private (only owner)
router.put('/:id', auth, updateGrievance);

export default router;