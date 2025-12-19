import Query from "../models/Query.js";
import { createNotification } from "./notificationController.js";



export const createQuery = async (req, res) => {
  const query = await Query.create({
    studentId: req.user.userId,     // student from JWT
    supervisorId: req.body.supervisorId,
    subject: req.body.subject,
    question: req.body.question,
    status: "Open"
  });

  // 🔔 NOTIFY SUPERVISOR
  await createNotification(
    query.supervisorId,
    "A new query has been submitted by a student"
  );

  res.status(201).json(query);
};



export const markPending = async (req, res) => {
  const query = await Query.findByIdAndUpdate(
    req.params.id,
    { status: "Pending" },
    { new: true }
  );
  res.json(query);
};


export const answerQuery = async (req, res) => {
  const { response } = req.body;

  const query = await Query.findByIdAndUpdate(
    req.params.id,
    {
      response,
      status: "Closed"
    },
    { new: true }
  );

 
  await createNotification(
    query.studentId,
    "Your query has been answered by the supervisor"
  );

  res.json(query);
};


export const getQueriesByStatus = async (req, res) => {
  const { status } = req.params;
  const queries = await Query.find({ status });
  res.json(queries);
};

export const getQueries = async (req, res) => {
  const queries = await Query.find();
  res.json(queries);
};
