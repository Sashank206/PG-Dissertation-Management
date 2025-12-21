import Dissertation from "../models/Dissertation.js";

export const createDissertation = async (req, res) => {
  const dissertation = await Dissertation.create(req.body);
  res.status(201).json(dissertation);
};


export const getDissertations = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query = {};

    if (role === 'supervisor') {
      query = { supervisorId: userId };
    } else if (role === 'student') {
      query = { studentId: userId };
    }

    const data = await Dissertation.find(query)
      .populate('studentId', 'name email')
      .populate('supervisorId', 'name email')
      .populate('departmentId', 'departmentName');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dissertations" });
  }
};

export const updateDissertationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const dissertation = await Dissertation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!dissertation) {
      return res.status(404).json({ message: "Dissertation not found" });
    }

    res.json(dissertation);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
