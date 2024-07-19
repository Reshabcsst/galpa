import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditServiceDialog = ({ open, onClose, service, onSave, onFieldChange, onFileChange, ServerURL }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (service && service.image) {
            if (service.image instanceof File) {
                const url = URL.createObjectURL(service.image);
                setPreviewUrl(url);
            } else {
                const url = `${ServerURL}${service.image}`;
                setPreviewUrl(url);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [service]);

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
        if (!service.name) newErrors.name = 'Name is required';
        if (!service.details) newErrors.details = 'Details is required';
        if (!service.image) newErrors.image = 'Image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (service && !service.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{service && service.id ? 'Edit service' : 'Add service'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder='Name'
                            name="name"
                            value={service ? service.name : ''}
                            onChange={onFieldChange}
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="details">Details</label>
                        <input
                            type="text"
                            id="details"
                            placeholder='Details'
                            name="details"
                            value={service ? service.details : ''}
                            onChange={onFieldChange}
                        />
                        {errors.details && <p style={{ color: 'red' }}>{errors.details}</p>}
                    </div>
                    <div className="custom-file-input">
                        <label style={{ marginRight: ".5rem" }} htmlFor="image">Choose image</label>
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

export default EditServiceDialog;
