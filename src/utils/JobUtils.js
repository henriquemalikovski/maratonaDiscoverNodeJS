module.exports = {
  remainingDays(job) {
    //Ajustes no job
    //calculo de tempo restante
    const remainingDays = (job.total_hours / job.daily_hours).toFixed();
    const createdDate = new Date(job.createdAt);
    const dueDay = createdDate.getDate() + Number(remainingDays);
    const dueDate = createdDate.setDate(dueDay);

    const timeDiffInMs = dueDate - Date.now();
    // transformart milisec em dias
    const dayInMs = 1000 * 60 * 60 * 24;
    const dayDiff = Math.ceil(timeDiffInMs / dayInMs);

    return dayDiff;
  },
  calculeteBudget: (total_hours, valueHour) => valueHour * total_hours,
};
