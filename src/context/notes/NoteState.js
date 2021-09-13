import React, { useState } from 'react'
import NoteContext from './noteContext'

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    // Get all notes from the database
    const getNotes = async () => {
        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json();
        setNotes(json);
    }

    // Add a note
    const addNote = async (title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });

        const note = await response.json();
        setNotes(notes.concat(note));

    }

    // Delete the note
    const deleteNote = async (id) => {
        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json();
        console.log(json);


        const newNote = notes.filter((note) => { return note._id !== id });
        setNotes(newNote);
    }

    // Edit the note
    const editNote = async (id, title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });

        const json = await response.json();
        console.log(json);

        let newNote = JSON.parse(JSON.stringify(notes));
        // Login to wait in client
        for (let i = 0; i < newNote.length; i++) {
            const element = newNote[i];
            if (element._id === id) {
                newNote[i].title = title;
                newNote[i].description = description;
                newNote[i].tag = tag;
                break;
            }
        }
        setNotes(newNote);
    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }} >
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;