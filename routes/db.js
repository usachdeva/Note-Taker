const db = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const { readFromFile, writeToFile } = require("../helpers/fsUtils");

// to get all the notes
db.get("/", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// to get a specific note
db.get("/:note_id", async (req, res) => {
    const noteId = req.params.note_id;

    try {
        const data = await readFromFile("./db/db.json");

        let parsedNotes = JSON.parse(data);

        const result = parsedNotes.filter((item) => item.note_id == noteId);

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: "Note not found" });
        }
    } catch (err) {
        console.error(`The error found : `, err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});

// to add a new note to the
db.post("/", async (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = { title, text, note_id: uuidv4() };

        try {
            const data = await readFromFile("./db/db.json");
            let parsedNotes = JSON.parse(data);
            if (!Array.isArray(parsedNotes)) {
                parsedNotes = [];
            }

            parsedNotes.push(newNote);
            await writeToFile(
                "./db/db.json",
                JSON.stringify(parsedNotes, null, 4)
            );
            res.status(201).json(newNote);

            console.info("Successfully updated notes!");
        } catch (err) {
            console.error("Error handling notes:", err);
            res.status(500).json({ error: "Failed to save note" });
        }
    } else {
        res.status(400).json({ error: "Title and text are required" });
    }
});

// to delete a specific note
db.delete("/:note_id", async (req, res) => {
    const noteId = req.params.note_id;

    try {
        const data = await readFromFile("./db/db.json");

        let parsedNotes = JSON.parse(data);

        const result = parsedNotes.filter((item) => item.note_id !== noteId);

        await writeToFile("./db/db.json", JSON.stringify(result, null, 4));

        res.json(`Item ${noteId} has been deleted 🗑️`);
    } catch (err) {
        console.error("Error handling notes:", err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});

module.exports = db;
