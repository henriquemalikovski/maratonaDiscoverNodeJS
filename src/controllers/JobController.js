const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  async save(req, res) {
    const profile = await Profile.get();

    const budget = JobUtils.calculeteBudget(req.body.total_hours, profile.value_hour);

    //update
    await Job.save({
      ... req.body,
      createdAt: Date.now(),
      budget: budget
    });

    return res.redirect("/");
  },
  create(req, res) {
    return res.render("job");
  },
  async show(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    const jobId = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    job.budget = JobUtils.calculeteBudget(job.total_hours, profile.value_hour);

    return res.render("job-edit", { job });
  },
  async update(req, res) {
    const jobs = await Job.get(); 
    const profile = await Profile.get();

    const jobId = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const budget = JobUtils.calculeteBudget(req.body.total_hours, profile.value_hour);

    const updatedJob = {
      ...job,
      name: req.body.name,
      total_hours: req.body.total_hours,
      daily_hours: req.body.daily_hours,
      budget: budget
    };

    await Job.update(updatedJob);

    return res.redirect("/job/" + jobId);
  },
  async delete(req, res) {
    const jobId = req.params.id;

    await Job.delete(jobId);

    return res.redirect("/");
  },
};
