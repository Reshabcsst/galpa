import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Divider } from '@mui/material';

const EditAuthorDialog = ({ open, onClose, author, onSave, onFieldChange, onFileChange, onBookChange, onAddBook, ServerURL }) => {
    const [previewUrls, setPreviewUrls] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const newPreviewUrls = {};
        if (author && author.profilePic) {
            if (author.profilePic instanceof File) {
                const url = URL.createObjectURL(author.profilePic);
                newPreviewUrls.profilePic = url;
            } else {
                const url = `${ServerURL}${author.profilePic}`;
                newPreviewUrls.profilePic = url;
            }
        } else {
            newPreviewUrls.profilePic = null;
        }

        if (author && author.books) {
            newPreviewUrls.books = author.books.map(book => {
                if (book.bookImage || book.bookImagePath) {
                    return {
                        ...book,
                        bookImageUrl: book.bookImage instanceof File
                            ? URL.createObjectURL(book.bookImage)
                            : `${ServerURL}${book.bookImagePath}`
                    };
                } else {
                    return book;
                }
            });
        }


        setPreviewUrls(newPreviewUrls);
    }, [author, ServerURL]);

    const handleImageChange = (e, field, index = null) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (index !== null) {
                setPreviewUrls(prev => {
                    const newBooks = [...prev.books];
                    newBooks[index].bookImageUrl = url;
                    return { ...prev, books: newBooks };
                });
                onBookChange(index, e);
            } else {
                setPreviewUrls(prev => ({ ...prev, [field]: url }));
                onFileChange(e);
            }
        } else {
            if (index !== null) {
                setPreviewUrls(prev => {
                    const newBooks = [...prev.books];
                    newBooks[index].bookImageUrl = null;
                    return { ...prev, books: newBooks };
                });
            } else {
                setPreviewUrls(prev => ({ ...prev, [field]: null }));
            }
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!author.name) newErrors.name = 'Name is required';
        if (!author.details) newErrors.details = 'Details are required';
        if (!author.profilePic) newErrors.profilePic = 'Profile Picture is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{author && author.id ? 'Edit Author' : 'Add Author'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            name="name"
                            value={author ? author.name : ''}
                            onChange={onFieldChange}
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="details">Details</label>
                        <textarea
                            id="details"
                            placeholder="Details"
                            name="details"
                            value={author ? author.details : ''}
                            onChange={onFieldChange}
                            rows="4"
                            style={{ width: '100%' }}
                        />
                        {errors.details && <p style={{ color: 'red' }}>{errors.details}</p>}
                    </div>
                    <div>
                        <label htmlFor="profilePic">Profile Picture</label>
                        <input
                            type="file"
                            id="profilePic"
                            name="profilePic"
                            onChange={(e) => handleImageChange(e, 'profilePic')}
                        />
                        {errors.profilePic && <p style={{ color: 'red' }}>{errors.profilePic}</p>}
                        {previewUrls.profilePic && (
                            <img
                                src={previewUrls.profilePic}
                                alt="Profile Preview"
                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }}
                            />
                        )}
                    </div>

                    <Divider sx={{mt:"2rem"}}/>
                    {author && author.books && author.books.map((book, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <label htmlFor={`bookName-${index}`}>Book Name</label>
                            <input
                                type="text"
                                id={`bookName-${index}`}
                                placeholder="Book Name"
                                name="bookName"
                                value={book.bookName}
                                onChange={(e) => onBookChange(index, e)}
                            />
                            <label htmlFor={`bookImage-${index}`}>Book Image</label>
                            <input
                                type="file"
                                id={`bookImage-${index}`}
                                name="bookImage"
                                onChange={(e) => handleImageChange(e, 'bookImage', index)}
                            />
                            {previewUrls.books && previewUrls.books[index] && previewUrls.books[index].bookImageUrl && (
                                <img
                                    src={previewUrls.books[index].bookImageUrl}
                                    alt="Book Preview"
                                    style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    ))}
                    <button className="add" onClick={onAddBook} style={{ marginTop: '20px' }}>Add Book</button>
                </div>
            </DialogContent>
            <DialogActions>
                <button className="add" onClick={handleSave}>Save</button>
                <button className="add" onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAuthorDialog;
