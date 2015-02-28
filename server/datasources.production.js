module.exports = {
  bossdb: {
    defaultForType: "mongodb",
    name: "bossdb",
    connector: "mongodb",
    url: process.env.BOSSDB_URL
  }
};
