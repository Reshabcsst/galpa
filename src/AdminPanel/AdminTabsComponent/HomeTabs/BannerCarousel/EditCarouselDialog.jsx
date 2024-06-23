import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditCarouselDialog = ({ open, onClose, carousel, onSave, onFieldChange, onFileChange }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (carousel && carousel.backgroundImage) {
            if (carousel.backgroundImage instanceof File) {
                const url = URL.createObjectURL(carousel.backgroundImage);
                setPreviewUrl(url);
            } else {
                const url = `http://localhost:5241${carousel.backgroundImage}`;
                setPreviewUrl(url);
            }
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

    const validateFields = () => {
        const newErrors = {};
        if (!carousel.heading) newErrors.heading = 'Heading is required';
        if (!carousel.subheading) newErrors.subheading = 'Subheading is required';
        if (!carousel.backgroundImage) newErrors.backgroundImage = 'Background image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (carousel && !carousel.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{carousel && carousel.id ? 'Edit Carousel' : 'Add Carousel'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="heading">Heading</label>
                        <input
                            type="text"
                            id="heading"
                            placeholder='heading'
                            name="heading"
                            value={carousel ? carousel.heading : ''}
                            onChange={onFieldChange}
                            />
                        {errors.heading && <p style={{ color: 'red' }}>{errors.heading}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="subheading">Subheading</label>
                        <input
                            type="text"
                            id="subheading"
                            placeholder='subheading'
                            name="subheading"
                            value={carousel ? carousel.subheading : ''}
                            onChange={onFieldChange}
                            />
                        {errors.subheading && <p style={{ color: 'red' }}>{errors.subheading}</p>}
                    </div>
                    <div className="custom-file-input">
                        <label style={{ marginRight: ".5rem" }} htmlFor="backgroundImage">Choose image</label>
                        <button className="button">Choose File</button>
                        <input
                            margin="dense"
                            id="backgroundImage"
                            name="backgroundImage"
                            type="file"
                            onChange={handleImageChange}
                        />
                    </div>
                    {errors.backgroundImage && <p style={{ color: 'red' }}>{errors.backgroundImage}</p>}
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

export default EditCarouselDialog;
