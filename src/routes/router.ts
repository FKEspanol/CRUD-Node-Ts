import express from "express";
import { v4 as uuid } from "uuid";
import type { Request, Response } from "express";

// custom utils
import { catchError } from "../utils/catchError"; // for handling errors on try catch block
import updateDb from "../utils/updateDb"; // update db
import { noteNotFound, validateAddNote } from "../utils/clientError";

// custom types
import type { AddNoteValidation } from "../types/responseType";
import type Note from "../types/notesData";

// import database
let notesData: Note[] = require("../../data/notes.json");

const route = express.Router();

route.get("/getNotes", async (req: Request, res: Response) => {
    try {
        res.status(200).json(notesData);
    } catch (error) {
        catchError(error);
    }
});
export default route;

route.get("/getNote/:id", (req: Request, res: Response) => {
    try {
        const foundNote: Note | undefined = notesData.find(
            (note) => note.id === req.params.id
        );

        if (!foundNote) {
            return noteNotFound(res);
        } else {
            res.status(200).json(foundNote);
        }
    } catch (error) {
        catchError(error);
    }
});

route.post("/addNote", async (req: Request, res: Response) => {
    try {
        let validationErrors: AddNoteValidation[] = [];
        const {
            category,
            title,
            noteBody,
        }: Pick<Note, "title" | "category" | "noteBody"> = req.body;

        !category
            ? validationErrors.push(validateAddNote("category"))
            : !title
            ? validationErrors.push(validateAddNote("title"))
            : !noteBody
            ? validationErrors.push(validateAddNote("noteBody"))
            : "";

        if (validationErrors.length)
            return res.status(400).json(validationErrors);
        notesData.push({ id: uuid(), category, title, noteBody });
        updateDb(notesData);

        res.status(201).json({
            message: `A note titled '${title}' has been added`,
            notesData,
        });
    } catch (error) {
        catchError(error);
    }
});

route.put("/editNote/:id", async (req: Request, res: Response) => {
    try {
        const noteId: string = req.params.id;
        let indexNum: number = 0;

        const foundNote: Note | undefined = notesData.find((note, index) => {
            if (note.id === noteId) {
                indexNum = index;
                return note;
            }
        });
        if (!foundNote) {
            return noteNotFound(res);
        } else {
            notesData[indexNum] = req.body as Note;
            updateDb(notesData);
            res.status(201).json({
                message: `A note titled '${foundNote.title}' has been updated`,
                notesData,
            });
        }
    } catch (error) {
        catchError(error);
    }
});

route.delete("/deleteNote/:id", async (req: Request, res: Response) => {
    try {
        const noteId: string = req.params.id;
        const noteToDelete: Note | undefined = notesData.find(
            (note) => note.id === noteId
        );

        if (!noteToDelete) return noteNotFound(res);

        const filteredNotes: Note[] = notesData.filter(
            (note) => note.id != noteToDelete.id
        );
        notesData = filteredNotes;
        updateDb(notesData);
        res.status(201).json({
            message: `A note titled '${noteToDelete.title}' has been deleted`,
            notesData,
        });
    } catch (error) {
        catchError(error);
    }
});
