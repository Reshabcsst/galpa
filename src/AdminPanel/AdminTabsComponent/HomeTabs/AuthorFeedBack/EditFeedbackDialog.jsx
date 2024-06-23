import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditFeedbackDialog = ({ open, onClose, feedbackItem, onSave, onFieldChange, onFileChange }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (feedbackItem && feedbackItem.image) {
            if (feedbackItem.image instanceof File) {
                const url = URL.createObjectURL(feedbackItem.image);
                setPreviewUrl(url);
            } else {
                const url = `http://localhost:5241${feedbackItem.image}`;
                setPreviewUrl(url);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [feedbackItem]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onFileChange(e);
        } else {
            setPreviewUrl(null);
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!feedbackItem.name) newErrors.name = 'Name is required';
        if (!feedbackItem.quote) newErrors.quote = 'Quote is required';
        if (!feedbackItem.image) newErrors.image = 'Image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (feedbackItem && !feedbackItem.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{feedbackItem && feedbackItem.id ? 'Edit Carousel' : 'Add Carousel'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="heading">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder='Name'
                            name="name"
                            value={feedbackItem ? feedbackItem.name : ''}
                            onChange={onFieldChange}
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="subheading">Quote</label>
                        <input
                            type="text"
                            id="quote"
                            placeholder='Quote'
                            name="quote"
                            value={feedbackItem ? feedbackItem.quote : ''}
                            onChange={onFieldChange}
                           />
                        {errors.quote && <p style={{ color: 'red' }}>{errors.quote}</p>}
                    </div>
                    <div className="custom-file-input">
                        <label style={{ marginRight: ".5rem" }} htmlFor="backgroundImage">Choose image</label>
                        <button className="button">Choose File</button>
                        <input
                            margin="dense"
                            id="image"
                            name="image"
                            type="file"
                            onChange={handleImageChange}
                        />
                    </div>
                    {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
                </div>
                {previewUrl && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={previewUrl} alt="Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={handleSave}>Save</button>
                <button className='add' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditFeedbackDialog;
