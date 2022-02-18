module.exports = {
  HOST: "localhost",
  USER: "haniah2",
  PASSWORD: "@Lifechoices1234",
  DB: "animal adoptions",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
