import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditDetailsDialog = ({ open, onClose, Details, onSave, onFieldChange }) => {
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!Details.title1) newErrors.title1 = 'Title1 is required';
        if (!Details.details1) newErrors.details1 = 'Details1 is required';
        if (!Details.title2) newErrors.title2 = 'Title2 is required';
        if (!Details.details2) newErrors.details2 = 'Details2 is required';
        if (!Details.title3) newErrors.title3 = 'Title3 is required';
        if (!Details.details3) newErrors.details3 = 'Details3 is required';
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
                        <label htmlFor="Title1">Title1</label>
                        <input
                            type="text"
                            id="title1"
                            placeholder='Title1'
                            name="title1"
                            value={Details ? Details.title1 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.title1 && <p style={{ color: 'red' }}>{errors.title1}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="Details1">Details1</label>
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
                    <div>
                        <label htmlFor="Title2">Title2</label>
                        <input
                            type="text"
                            id="title2"
                            placeholder='Title2'
                            name="title2"
                            value={Details ? Details.title2 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.title2 && <p style={{ color: 'red' }}>{errors.title2}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="Details2">Details2</label>
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
                    <div>
                        <label htmlFor="Title3">Title3</label>
                        <input
                            type="text"
                            id="title3"
                            placeholder='Title3'
                            name="title3"
                            value={Details ? Details.title3 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.title3 && <p style={{ color: 'red' }}>{errors.title3}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="Details3">Details3</label>
                        <input
                            type="text"
                            id="details3"
                            placeholder='Details3'
                            name="details3"
                            value={Details ? Details.details3 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.details3 && <p style={{ color: 'red' }}>{errors.details3}</p>}
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
