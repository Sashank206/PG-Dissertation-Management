import Submission from "../models/Submission.js";
import Dissertation from "../models/Dissertation.js";
import Feedback from "../models/Feedback.js";

/* =====================================================
   SUBMIT DISSERTATION (NEW VERSION EVERY TIME)
   ===================================================== */
export const submitDissertation = async (req, res) => {
  try {
    const {
      title,
      abstract,
      departmentId,
      supervisorId,
      submissionMode
    } = req.body;

    const studentId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    /* -------------------------------------------------
       1. ONE DISSERTATION PER STUDENT (MASTER RECORD)
       ------------------------------------------------- */
    let dissertation = await Dissertation.findOne({ studentId });

    if (!dissertation) {
      dissertation = await Dissertation.create({
        studentId,
        title,
        abstract,
        departmentId,
        status: "Submitted"
      });
    } else {
      // Only update title / abstract if changed
      dissertation.title = title || dissertation.title;
      dissertation.abstract = abstract || dissertation.abstract;
      dissertation.departmentId = departmentId || dissertation.departmentId;
      dissertation.status = "Submitted";
      await dissertation.save();
    }

    /* -------------------------------------------------
       2. VERSIONING (VERY IMPORTANT)
       ------------------------------------------------- */
    const lastSubmission = await Submission.findOne({
      dissertationId: dissertation._id
    }).sort({ version: -1 });

    const version = lastSubmission ? lastSubmission.version + 1 : 1;

    /* -------------------------------------------------
       3. CREATE NEW SUBMISSION (NEVER UPDATE OLD ONES)
       ------------------------------------------------- */
    const submission = await Submission.create({
      dissertationId: dissertation._id,
      studentId,
      supervisorId, // ✅ PER SUBMISSION
      title,
      abstract,
      departmentId,
      fileUrl: `/uploads/dissertations/${req.file.filename}`,
      filePath: req.file.path,
      version,
      submissionMode: submissionMode || "Initial Submission",
      status: "pending"
    });

    res.status(201).json({
      message: "Dissertation submitted successfully",
      submission
    });

  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Server error during submission" });
  }
};

/* =====================================================
   GET SUBMISSIONS (ROLE BASED)
   ===================================================== */
export const getSubmissions = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query = {};

    // Students see only their own submissions
    if (role === "student") {
      query.studentId = userId;
    }

    // Supervisors see only submissions assigned to them
    if (role === "supervisor") {
      query.supervisorId = userId;
    }

    // Admins see all submissions (no filter)
    // if (role === "admin") { query remains {} }

    const submissions = await Submission.find(query)
      .populate("dissertationId")
      .populate("studentId", "name email")
      .populate("supervisorId", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

/* =====================================================
   REVIEW SUBMISSION (SUPERVISOR)
   ===================================================== */
export const reviewSubmission = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const supervisorId = req.user.userId;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.status = status;
    submission.reviewedAt = new Date();
    await submission.save();

    /* -------------------------------------------------
       SAVE FEEDBACK (OPTIONAL)
       ------------------------------------------------- */
    if (remarks) {
      await Feedback.create({
        submissionId: submission._id,
        dissertationId: submission.dissertationId,
        supervisorId,
        studentId: submission.studentId,
        comments: remarks
      });
    }


    const statusMap = {
      approved: "Approved",
      rejected: "Rejected",
      revision: "Revision",
      pending: "Under Review"
    };

    await Dissertation.findByIdAndUpdate(
      submission.dissertationId,
      { status: statusMap[status] || status }
    );

    res.json(submission);

  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Failed to review submission" });
  }
};
