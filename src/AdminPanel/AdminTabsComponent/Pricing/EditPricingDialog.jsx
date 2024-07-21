import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditPricingDialog = ({ open, onClose, Pricing, onSave, onFieldChange }) => {
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!Pricing.service) newErrors.service = 'Service is required';
        if (!Pricing.details) newErrors.details = 'Details 1 is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (Pricing && !Pricing.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{Pricing && Pricing.id ? 'Edit Pricing' : 'Add Pricing'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="service">Service Name</label>
                        <input
                            type="text"
                            id="service"
                            placeholder='Service Name'
                            name="service"
                            value={Pricing ? Pricing.service : ''}
                            onChange={onFieldChange}
                        />
                        {errors.service && <p style={{ color: 'red' }}>{errors.service}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="price">Price</label>
                        <input
                            type="text"
                            id="price"
                            placeholder='Price'
                            name="price"
                            value={Pricing ? Pricing.price : ''}
                            onChange={onFieldChange}
                        />
                        {errors.price && <p style={{ color: 'red' }}>{errors.price}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="feature1">Frature 1</label>
                        <input
                            type="text"
                            id="feature1"
                            placeholder='Feature 1'
                            name="feature1"
                            value={Pricing ? Pricing.feature1 : ''}
                            onChange={onFieldChange}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="feature2">Frature 2</label>
                        <input
                            type="text"
                            id="feature2"
                            placeholder='Feature 2'
                            name="feature2"
                            value={Pricing ? Pricing.feature2 : ''}
                            onChange={onFieldChange}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="feature3">Frature 3</label>
                        <input
                            type="text"
                            id="feature3"
                            placeholder='Feature 3'
                            name="feature3"
                            value={Pricing ? Pricing.feature3 : ''}
                            onChange={onFieldChange}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="feature4">Frature 4</label>
                        <input
                            type="text"
                            id="feature4"
                            placeholder='Feature 4'
                            name="feature4"
                            value={Pricing ? Pricing.feature4 : ''}
                            onChange={onFieldChange}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="feature5">Frature 5</label>
                        <input
                            type="text"
                            id="feature5"
                            placeholder='Feature 5'
                            name="feature5"
                            value={Pricing ? Pricing.feature5 : ''}
                            onChange={onFieldChange}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="details">Details </label>
                        <input
                            type="text"
                            id="details"
                            placeholder='Details '
                            name="details"
                            value={Pricing ? Pricing.details : ''}
                            onChange={onFieldChange}
                        />
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

export default EditPricingDialog;
