module.exports = {
  remainingDays(job) {
    //Ajustes no job
    //calculo de tempo restante
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
    const createdDate = new Date(job.createdAt);
    const dueDay = createdDate.getDate() + Number(remainingDays);
    const dueDate = createdDate.setDate(dueDay);

    const timeDiffInMs = dueDate - Date.now();
    // transformart milisec em dias
    const dayInMs = 1000 * 60 * 60 * 24;
    const dayDiff = Math.floor(timeDiffInMs / dayInMs);

    return dayDiff;
  },
  calculeteBudget: (job, valueHour) => valueHour * job["total-hours"],
};
