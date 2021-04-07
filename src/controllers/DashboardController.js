const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    let statusCounts = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      statusCounts[status] += 1;

      jobTotalHours = status === "progress" ? jobTotalHours += Number(job.daily_hours) : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculeteBudget(job.total_hours, profile.value_hour),
      };
    });

    let freeHours = profile.hours_per_day - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      status: statusCounts,
      freeHours: freeHours,
    });
  },
};
