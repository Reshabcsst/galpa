import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditBannerDialog = ({ open, onClose, Banner, onSave, onFieldChange, onFileChange, ServerURL }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (Banner && Banner.backgroundImage) {
            if (Banner.backgroundImage instanceof File) {
                const url = URL.createObjectURL(Banner.backgroundImage);
                setPreviewUrl(url);
            } else {
                const url = `${ServerURL}${Banner.backgroundImage}`;
                setPreviewUrl(url);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [Banner]);

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
        if (!Banner.heading) newErrors.heading = 'Heading is required';
        if (!Banner.subheading) newErrors.subheading = 'Subheading is required';
        if (!Banner.backgroundImage) newErrors.backgroundImage = 'Background image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (Banner && !Banner.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{Banner && Banner.id ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="heading">Heading</label>
                        <input
                            type="text"
                            id="heading"
                            placeholder='heading'
                            name="heading"
                            value={Banner ? Banner.heading : ''}
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
                            value={Banner ? Banner.subheading : ''}
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

export default EditBannerDialog;
