import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditDetailsDialog = ({ open, onClose, Details, onSave, onFieldChange, onFileChange, ServerURL }) => {
    const [errors, setErrors] = useState({});


    const validateFields = () => {
        const newErrors = {};
        if (!Details.title) newErrors.title = 'Title is required';
        if (!Details.details1) newErrors.details1 = 'Details1 is required';
        if (!Details.details2) newErrors.details2 = 'Details2 is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (Details && !Details.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{Details && Details.id ? 'Edit Details' : 'Add Details'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder='Title'
                            name="title"
                            value={Details ? Details.title : ''}
                            onChange={onFieldChange}
                        />
                        {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="details1">Details1</label>
                        <input
                            type="text"
                            id="details1"
                            placeholder='Details1'
                            name="details1"
                            value={Details ? Details.details1 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.details1 && <p style={{ color: 'red' }}>{errors.details1}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="details2">Details2</label>
                        <input
                            type="text"
                            id="details2"
                            placeholder='Details2'
                            name="details2"
                            value={Details ? Details.details2 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.details2 && <p style={{ color: 'red' }}>{errors.details2}</p>}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={handleSave}>Save</button>
                <button className='add' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDetailsDialog;
