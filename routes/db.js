const db = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require("../helpers/fsUtils");

// to get all the notes
db.get("/", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// to add a new note to the
db.post("/", async (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = { title, text, note_id: uuidv4() };

        try {
            // Read the existing notes from the file
            const data = await readFromFile("./db/db.json");

            // Attempt to parse JSON data
            let parsedNotes = JSON.parse(data);

            // Check if parsedNotes is an array
            if (!Array.isArray(parsedNotes)) {
                parsedNotes = [];
            }

            // Add the new note to the array
            parsedNotes.push(newNote);

            // Write the updated array back to the file
            await writeToFile(
                "./db/db.json",
                JSON.stringify(parsedNotes, null, 4)
            );

            // Respond with the new note
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

        // Filter out the object with the specific note_id
        const result = parsedNotes.filter((item) => item.note_id !== noteId);

        // Write the updated array back to the file
        await writeToFile("./db/db.json", JSON.stringify(result, null, 4));

        // Respond to the DELETE request
        res.json(`Item ${noteId} has been deleted 🗑️`);
    } catch (err) {
        console.error("Error handling notes:", err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});
module.exports = db;
