module.exports = {
  bossdb: {
    defaultForType: "mongodb",
    name: "bossdb",
    connector: "mongodb",
    url: process.env.BOSSDB_URL
  },
  "bossimgs": {
    connector: 'loopback-component-storage',
    provider: 'amazon',
    keyId: process.env.STORAGE_KEY_ID,
    key: process.env.STORAGE_KEY
  }
};
