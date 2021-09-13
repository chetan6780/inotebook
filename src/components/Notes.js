import React, { useContext, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import noteContext from "../context/notes/noteContext"
import Addnote from './Addnote';
import NoteItem from './NoteItem';

const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    let history = useHistory();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        } else {
            history.push('/login');
        }
        // eslint-disable-next-line
    }, [])

    const [note, setNote] = React.useState({ id: '', etitle: '', edescription: '', etag: 'default' });

    const ref = useRef(null);
    const refClose = useRef(null);

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("Note Updated successfully", "success");
        refClose.current.click();

    }

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    return (
        <>
            <Addnote showAlert={props.showAlert}/>
            <button type="button" ref={ref} className="btn btn-info d-none" data-bs-toggle="modal" data-bs-target="#exampleModal"> modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription"
                                        value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}  />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button  type="button" className="btn btn-secondary" ref={refClose} data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <h2>Your notes</h2>
                <h5 className="container text-center">
                    {notes.length === 0 && "No notes to display"}
                </h5>
                {notes.map((note) => {
                    return <NoteItem showAlert={props.showAlert} key={note._id} note={note} updateNote={updateNote} />;
                })}
            </div>
        </>
    )
}

export default Notes
