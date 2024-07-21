import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditDetailsDialog = ({ open, onClose, Details, onSave, onFieldChange }) => {
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!Details.ourLocation) newErrors.ourLocation = 'Our Location is required';
        if (!Details.number1) newErrors.number1 = 'Number 1 is required';
        if (!Details.number2) newErrors.number2 = 'Number 2 is required';
        if (!Details.opensAt) newErrors.opensAt = 'Opens At 2 is required';
        if (!Details.closeAt) newErrors.closeAt = 'Close At 2 is required';

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
                        <label htmlFor="ourLocation">Our Location</label>
                        <input
                            type="text"
                            id="ourLocation"
                            placeholder='ourLocation'
                            name="ourLocation"
                            value={Details ? Details.ourLocation : ''}
                            onChange={onFieldChange}
                        />
                        {errors.ourLocation && <p style={{ color: 'red' }}>{errors.ourLocation}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="number1">Number 1</label>
                        <input
                            type="text"
                            id="number1"
                            placeholder='number1'
                            name="number1"
                            value={Details ? Details.number1 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.number1 && <p style={{ color: 'red' }}>{errors.number1}</p>}
                    </div>
                    <div>
                        <label htmlFor="number2">number 2</label>
                        <input
                            type="text"
                            id="number2"
                            placeholder='number2'
                            name="number2"
                            value={Details ? Details.number2 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.number2 && <p style={{ color: 'red' }}>{errors.number2}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="opensAt">Opens At</label>
                        <input
                            type="text"
                            id="opensAt"
                            placeholder='opensAt'
                            name="opensAt"
                            value={Details ? Details.opensAt : ''}
                            onChange={onFieldChange}
                        />
                        {errors.opensAt && <p style={{ color: 'red' }}>{errors.opensAt}</p>}
                    </div>
                    <div>
                        <label htmlFor="closeAt">Close At</label>
                        <input
                            type="text"
                            id="closeAt"
                            placeholder='closeAt'
                            name="closeAt"
                            value={Details ? Details.closeAt : ''}
                            onChange={onFieldChange}
                        />
                        {errors.closeAt && <p style={{ color: 'red' }}>{errors.closeAt}</p>}
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
