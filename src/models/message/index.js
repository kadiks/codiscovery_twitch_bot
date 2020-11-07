const dao = require("./dao");

class Model {
  async insert({ data }) {
    try {
      const entry = new dao(data);
      const dbEntry = await entry.save();
      return dbEntry;
    } catch (err) {
      throw err;
    }
  }

  async getAll({ query = {}, limit = 20, skip = 0 }) {
    try {
      const entries = await dao.find(query, { limit, skip });
      return entries;
    } catch (err) {
      throw err;
    }
  }

  async getById(id) {
    try {
      const entry = await dao.findById(id);
      return entry;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Model;
