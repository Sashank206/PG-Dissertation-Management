import Dissertation from "../models/Dissertation.js";

export const createDissertation = async (req, res) => {
  const dissertation = await Dissertation.create(req.body);
  res.status(201).json(dissertation);
};

export const getDissertations = async (req, res) => {
  const data = await Dissertation.find();
  res.json(data);
};
