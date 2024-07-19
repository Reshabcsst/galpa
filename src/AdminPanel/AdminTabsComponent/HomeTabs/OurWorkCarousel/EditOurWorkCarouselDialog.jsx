import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditOurWorkCarouselDialog = ({ open, onClose, carousel, onSave, onFileChange, ServerURL }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (carousel && carousel.imagePath) {
            if (carousel.imagePath instanceof File) {
                const url = URL.createObjectURL(carousel.imagePath);
                setPreviewUrl(url);
            } else {
                const url = `${ServerURL}${carousel.imagePath}`;
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
        if (!carousel.imagePath) newErrors.imagePath = 'Image is required';
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
                    <div className="custom-file-input">
                        <label style={{ marginRight: ".5rem" }} htmlFor="backgroundImage">Choose image</label>
                        <button className="button">Choose File</button>
                        <input
                            margin="dense"
                            id="Image"
                            name="Image"
                            type="file"
                            onChange={handleImageChange}
                        />
                    </div>
                    {errors.imagePath && <p style={{ color: 'red' }}>{errors.imagePath}</p>}
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

export default EditOurWorkCarouselDialog;
