const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  save(req, res) {
    // req.body => { name: 'Teste', 'daily-hours': '3', 'total-hours': '3' }
    const jobs = Job.get();

    const job = req.body;
    const lastId = jobs[jobs.length - 1]?.id || 0;

    //update
    Job.save({
      id: lastId + 1,
      name: job.name,
      "daily-hours": job["daily-hours"],
      "total-hours": job["total-hours"],
      createdAt: Date.now(),
    });

    return res.redirect("/");
  },
  create(req, res) {
    return res.render("job");
  },
  show(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();

    const jobId = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    job.budget = JobUtils.calculeteBudget(job, profile["valueHour"]);

    return res.render("job-edit", { job });
  },
  update(req, res) {
    const jobs = Job.get();

    const jobId = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }
    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    const newJobs = jobs.map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }
      return job;
    });

    Job.update(newJobs);

    return res.redirect("/job/" + jobId);
  },
  delete(req, res) {
    const jobId = req.params.id;

    Job.delete(jobId);

    return res.redirect("/");
  },
};
