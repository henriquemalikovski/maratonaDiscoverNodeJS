const Database = require("../db/config");

module.exports = {
  async get() {
    const db = await Database();

    const data = await db.all(`select * from jobs`);

    await db.close();

    return data;
  },
  async save(newJob) {
    const db = await Database();

    await db.run(`INSERT INTO jobs (
          name,
          daily_hours,
          total_hours,
          createdAt,
          budget
      ) VALUES (
          "${newJob.name}", 
          ${newJob.daily_hours},
          ${newJob.total_hours},
          ${newJob.createdAt},
          ${newJob.budget}
      )`);

    await db.close();
  },
  async update(updateJob) {
    const db = await Database();

    await db.run(`UPDATE jobs SET 
        name = "${updateJob.name}",
        daily_hours = ${updateJob.daily_hours},
        total_hours = ${updateJob.total_hours},
        createdAt = ${updateJob.createdAt},
        budget = ${updateJob.budget} 
      WHERE id = ${updateJob.id}`
    );

    await db.close();
  },
  async delete(id) {
    const db = await Database();

    await db.run(`DELETE FROM jobs WHERE id == ${id}`);

    await db.close();
  },
};
