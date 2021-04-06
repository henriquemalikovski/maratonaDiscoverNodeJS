let data = [
  {
    id: 1,
    name: "Pizzaria Guloso",
    "daily-hours": 2,
    "total-hours": 1,
    createdAt: Date.now(),
    budget: 4500,
  },
  {
    id: 2,
    name: "OneTwo Projects",
    "daily-hours": 3,
    "total-hours": 47,
    createdAt: Date.now(),
    budget: 4500,
  },
];

module.exports = {
  get() {
    return data;
  },
  save(newJob) {
    data.push(newJob);
  },
  update(newJobs) {
    data = newJobs;
  },
  delete(id) {
    data = data.filter((job) => Number(job.id) !== Number(id));
  },
};
