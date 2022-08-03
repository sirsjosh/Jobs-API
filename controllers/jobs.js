const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { _id },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: _id });

  if (!job) {
    throw res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No job with id ${jobId}` });
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { _id },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "company or position fields cannot be empty" });
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: _id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No job with id ${jobId}` });
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { _id },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: _id });

  if (!job) {
    throw res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No job with id ${jobId}` });
  }
  res.status(StatusCodes.OK).json({ msg: "Deleted" });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
