const fs = require("fs");
const path = require("path");
const router = require("express").Router();
const notes = require("../../db/notes");
const { nanoid } = require("nanoid");
const id = nanoid();
//endpoint to get the stored notes
router.get("/notes", (req, res) => {
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      res.send(404);
    } else {
      let getNote = JSON.parse(data);
      res.json(getNote);
    }
  });
});

function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}

// endpoint to post new notes
router.post("/notes", (req, res) => {
  const { title, text } = req.body;
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not properly formatted.");
  } else {
    const newNote = {
      title,
      text,
      id: id,
    };
    fs.readFile("./db/notes.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        //convert string into JSON object
        const parsedNotes = JSON.parse(data);

        //add a new note
        parsedNotes.push(newNote);

        fs.writeFile(
          "./db/notes.json",
          JSON.stringify(parsedNotes, null, 2),
          (writeERR) =>
            writeERR
              ? console.error(writeERR)
              : console.log("Thank you for updating your note")
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.json(response);
  }
});

// endpoint for delete
router.delete("/notes/:id", (req, res) => {
  console.log("req params", req.params.id);
  const deletedItem = notes.filter(({ id }) => id != req.params.id);
  fs.writeFile(
    "./db/notes.json",
    JSON.stringify(deletedItem, null, 2),
    (writeERR) =>
      writeERR
        ? console.error(writeERR)
        : console.info("successfull update notes")
  );
  res.json(deletedItem);
});

module.exports = router;
