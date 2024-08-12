import Note from "./notesData";

interface AddNoteValidation {
    key: keyof Note;
    message: string;
}

export { AddNoteValidation };
