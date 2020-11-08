const _ = require("lodash");

const dao = require("./dao");
const dateMgr = require("../../utils/date");
const politenessList = require("../../../config/politeness.json");

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

  async getCountByPeriod({ period }) {
    try {
      const startingDate = dateMgr.getStartingDateByPeriod({ period });

      const count = await dao
        .find({
          created: {
            // $lte: new Date(),
            $gte: startingDate,
          },
        })
        .count();

      return { count };
    } catch (err) {
      throw err;
    }
  }

  async getPolitePeopleByPeriod({ period }) {
    const startingDate = dateMgr.getStartingDateByPeriod({ period });

    const selectedWords = politenessList;
    // const selectedWord = "hello";

    const allMessages = await Promise.all(
      selectedWords.map((selectedWord) =>
        dao.find({
          $text: { $search: selectedWord },
          created: {
            // $lte: new Date(),
            $gte: startingDate,
          },
        })
      )
    );

    const messages = _.flatten(allMessages);

    const politePeople = {};
    messages.forEach((message) => {
      const { username, displayName } = message;
      if (politePeople.hasOwnProperty(username) === false) {
        politePeople[username] = {
          count: 0,
          displayName,
          username,
        };
      }
      politePeople[username].count += 1;
      politePeople[username].message = message;
    });

    // const data = await dao.find({
    //   $text: {
    //     $search: "salut",
    //   },
    // });

    // console.log(
    //   "MessageModel#getPolitePeopleByPeriod politePeople",
    //   politePeople
    // );

    const politePeopleArr = Object.values(politePeople);

    politePeopleArr.sort((a, b) => {
      return b.count - a.count;
    });

    return politePeopleArr;
  }
}

module.exports = new Model();
