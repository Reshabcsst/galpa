import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditPartnerDialog = ({ open, onClose, partner, onSave, onFieldChange, onFileChange, ServerURL }) => {
    const [previewUrls, setPreviewUrls] = useState({});
    const [newPreviewUrls, setNewPreviewUrls] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (partner && partner.imageLink) {
            const links = partner.imageLink.split(';');
            const newPreviewUrls = links.reduce((acc, link, index) => {
                acc[`image${index}`] = `${ServerURL}${link}`;
                return acc;
            }, {});
            setPreviewUrls(newPreviewUrls);
        } else {
            setPreviewUrls({});
        }
    }, [partner, ServerURL]);

    useEffect(() => {
        if (!partner) {
            setPreviewUrls({});
            setNewPreviewUrls({});
        }
    }, [partner]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newFilesPreviewUrls = files.reduce((acc, file, index) => {
            acc[`newImage${index}`] = URL.createObjectURL(file);
            return acc;
        }, {});
        setNewPreviewUrls(newFilesPreviewUrls);
        onFileChange(e);
    };

    const validateFields = () => {
        const newErrors = {};
        if (!partner?.name) newErrors.name = 'Name is required';
        if (!partner?.description) newErrors.description = 'Description is required';
        if (Object.keys(previewUrls).length === 0 && Object.keys(newPreviewUrls).length === 0) {
            newErrors.imageLink = 'At least one image is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateFields()) {
            onSave();
            window.location.reload();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{partner && partner.partnerId ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            name="name"
                            value={partner ? partner.name : ''}
                            onChange={onFieldChange}
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Description"
                            name="description"
                            value={partner ? partner.description : ''}
                            onChange={onFieldChange}
                            rows="4"
                            style={{ width: '100%' }}
                        />
                        {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
                    </div>
                    <div>
                        <label htmlFor="images">Images</label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            multiple
                            onChange={handleImageChange}
                        />
                        {errors.imageLink && <p style={{ color: 'red' }}>{errors.imageLink}</p>}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {Object.keys(previewUrls).map(key => (
                                <img
                                    key={key}
                                    src={previewUrls[key]}
                                    alt={`Preview ${key}`}
                                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                />
                            ))}
                            {Object.keys(newPreviewUrls).map(key => (
                                <img
                                    key={key}
                                    src={newPreviewUrls[key]}
                                    alt={`Preview ${key}`}
                                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button className="add" onClick={handleSave}>Save</button>
                <button className="add" onClick={() => { onClose(); window.location.reload(); }}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPartnerDialog;
