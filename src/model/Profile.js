let data = {
  name: "Henrique Malikovski",
  avatar: "https://github.com/henriquemalikovski.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  valueHour: 75,
};

module.exports = {
  get() {
    return data;
  },
  update(newData) {
    data = newData;
  },
};
