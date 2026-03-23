import Grievance from '../models/Grievance.js';

// Create a new grievance
export const createGrievance = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const grievance = new Grievance({
      title,
      description,
      category,
      location,
      user: userId,
    });

    await grievance.save();

    // Populate user data before sending response
    await grievance.populate('user', 'phoneNumber');

    res.status(201).json({ 
      message: 'Grievance created successfully', 
      grievance 
    });
  } catch (error) {
    console.error('Create grievance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all grievances
export const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate('user', 'phoneNumber')
      .sort({ createdAt: -1 });
    
    // Add vote count to each grievance
    const grievancesWithVoteCount = grievances.map(grievance => ({
      ...grievance.toObject(),
      voteCount: grievance.votes.length
    }));

    res.status(200).json(grievancesWithVoteCount);
  } catch (error) {
    console.error('Get all grievances error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single grievance by ID
export const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('user', 'phoneNumber')
      .populate('votes.user', 'phoneNumber');

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    const grievanceWithVoteCount = {
      ...grievance.toObject(),
      voteCount: grievance.votes.length
    };

    res.status(200).json(grievanceWithVoteCount);
  } catch (error) {
    console.error('Get grievance by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Vote on a grievance
export const voteGrievance = async (req, res) => {
  try {
    const grievanceId = req.params.id;
    const userId = req.user.id; // From auth middleware

    const grievance = await Grievance.findById(grievanceId);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    const existingVote = grievance.votes.find(
      vote => vote.user.toString() === userId
    );

    if (existingVote) {
      // Remove vote (unvote)
      grievance.votes = grievance.votes.filter(
        vote => vote.user.toString() !== userId
      );
    } else {
      // Add vote
      grievance.votes.push({ user: userId });
    }

    await grievance.save();

    res.status(200).json({ 
      message: existingVote ? 'Vote removed successfully' : 'Vote added successfully',
      voteCount: grievance.votes.length,
      voted: !existingVote
    });
  } catch (error) {
    console.error('Vote grievance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//update grievance
export const updateGrievance = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user)
    console.log("BODY:", req.body)

    const { id } = req.params
    const { status } = req.body

    const grievance = await Grievance.findById(id)

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" })
    }

    if (!grievance.user) {
      return res.status(400).json({ message: "No user linked to grievance" })
    }

    if (grievance.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    if (status) grievance.status = status

    await grievance.save()

    res.json({ message: "Updated successfully", grievance })
  } catch (err) {
    console.error("ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}