import Note from "../types/notesData";
import type { Response } from "express";
import { AddNoteValidation } from "../types/responseType";

const noteNotFound = (res: Response) => {
    res.status(404).json({
        message: `Note not found`,
    });
};

const validateAddNote = (key: keyof Note): AddNoteValidation => {
    return {
        key,
        message: `${key} is required`,
    };
};

export { noteNotFound, validateAddNote };
