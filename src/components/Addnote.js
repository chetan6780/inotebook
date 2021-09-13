import React, { useContext } from 'react'
import noteContext from "../context/notes/noteContext"

const Addnote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = React.useState({ title: '', description: '', tags: '' });

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tags);
        setNote({ title: '', description: '', tags: '' })
        props.showAlert("New Note Added successfully", "success")
    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    return (
        <div className="container my-3">
            <h2>Add New note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={note.title} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tags" name="tags" value={note.tags} onChange={onChange} />
                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add New Note</button>
            </form>
        </div>
    )
}

export default Addnote
