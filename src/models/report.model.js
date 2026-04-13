import mongoose from "mongoose";

/* ---------------- SUB SCHEMAS ---------------- */

const personalDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Not Provided" },
    email: { type: String },
    phone: { type: String },
    links: [String], // GitHub, LinkedIn, Portfolio
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String },
    institution: { type: String },
    year: { type: String },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
  },
  { _id: false },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
    resources: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
      trim: true,
    },
    tasks: [
      {
        type: String,
        required: [true, "Task is required"],
        trim: true,
      },
    ],
  },
  { _id: false },
);

/* ---------------- MAIN SCHEMA ---------------- */

const reportSchema = new mongoose.Schema(
  {
    personalDetails: personalDetailsSchema,
    education: [educationSchema],
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "General",
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    resume: {
      type: String,
      select: false, //  hide heavy/sensitive data by default
    },

    selfDescription: {
      type: String,
      select: false,
    },
    companyInsights: {
      type: String,
      trim: true,
      required: [true, "Company insights are required"],
    },
    technicalQuestions: [questionSchema],
    behavioralQuestions: [questionSchema],

    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    optimizedResumeContent: { type: Object, default: null },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //  consistent naming
      required: true,
      index: true, //  fast queries
    },

    hash: {
      type: String,
      required: true,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

/* ---------------- INDEXES ---------------- */

//  fast sorting + filtering
reportSchema.index({ user: 1, createdAt: -1 });

/* ---------------- MODEL ---------------- */

const Report = mongoose.model("Report", reportSchema);

export default Report;
