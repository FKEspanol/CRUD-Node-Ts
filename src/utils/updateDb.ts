import fsPromises from "fs/promises";
import path from "path";
import Note from "../types/notesData";

const dbPath = path.join(__dirname, "../../data", "notes.json");

const updateDb = async (notesData: Note[]) => {
    await fsPromises.writeFile(
        dbPath,
        JSON.stringify(notesData, null, 2),
        "utf-8"
    );
};

export default updateDb;
