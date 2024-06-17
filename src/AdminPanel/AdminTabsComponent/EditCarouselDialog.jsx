import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EditCarouselDialog = ({ open, onClose, carousel, onSave, onFieldChange, onFileChange }) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (carousel && carousel.backgroundImage) {
            const url = `http://localhost:5241${carousel.backgroundImage}`;
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    }, [carousel]);

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

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{carousel && carousel.id ? 'Edit Carousel' : 'Add Carousel'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="heading"
                        name="heading"
                        label="Heading"
                        fullWidth
                        value={carousel ? carousel.heading : ''}
                        onChange={onFieldChange}
                    />
                    <TextField
                        margin="dense"
                        id="subheading"
                        name="subheading"
                        label="Subheading"
                        fullWidth
                        value={carousel ? carousel.subheading : ''}
                        onChange={onFieldChange}
                    />
                    <input
                        margin="dense"
                        id="backgroundImage"
                        name="backgroundImage"
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
                {previewUrl && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={previewUrl} alt="Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={onSave}>Save</button>
                <button className='add' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCarouselDialog;
