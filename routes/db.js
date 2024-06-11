const db = require("express").Router();
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require("../helpers/fsUtils");

// to get all the notes
db.get("/", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// to delete a specific note
db.delete("/:db_id", (req, res) => {
    const dbId = req.params.db_id;
    readFromFile("./db/db.json")
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all tips except the one with the ID provided in the URL
            const result = json.filter((db) => db.db_id !== dbId);

            // Save that array to the filesystem
            writeToFile("./db/db.json", result);

            // Respond to the DELETE request
            res.json(`Item ${dbId} has been deleted 🗑️`);
        });
});

module.exports = db;
