import Job from '../models/Job.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  console.log(jobs);

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

export const getJob = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;

  const job = await Job.findOne({ _id: id, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${id} found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    job,
  });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

export const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id },
    user: { userId },
  } = req;

  if (!company || !position) {
    throw new BadRequestError('Company or Postion fields cannot be empty');
  }

  const job = await Job.findOneAndUpdate({ _id: id, createdBy: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${id} found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    job,
  });
};

export const deleteJob = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;

  const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${id} found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: null,
  });
};
