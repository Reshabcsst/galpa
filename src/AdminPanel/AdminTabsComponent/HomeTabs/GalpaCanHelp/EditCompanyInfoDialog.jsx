import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const EditCompanyInfoDialog = ({ open, onClose, companyInfo, onSave, onInputChange }) => {
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!companyInfo.subheading) newErrors.subheading = 'Subheading is required';
        if (!companyInfo.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
        if (!companyInfo.email) newErrors.email = 'Email is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (companyInfo && !companyInfo.id && !validateFields()) {
            return;
        }
        onSave();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{companyInfo && companyInfo.id ? 'Edit Company Info' : 'Add Company Info'}</DialogTitle>
            <DialogContent>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="Subheading">SubHeading</label>
                        <input
                            type="text"
                            id="Subheading"
                            placeholder='Subheading'
                            name="subheading"
                            value={companyInfo ? companyInfo.subheading : ''}
                            onChange={onInputChange}
                        />
                        {errors.subheading && <p style={{ color: 'red' }}>{errors.subheading}</p>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder='Phone Number'
                            name="phoneNumber"
                            value={companyInfo ? companyInfo.phoneNumber : ''}
                            onChange={onInputChange}
                        />
                        {errors.phoneNumber && <p style={{ color: 'red' }}>{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Email</label>
                        <input
                            type="text"
                            id="email"
                            placeholder='Email'
                            name="email"
                            value={companyInfo ? companyInfo.email : ''}
                            onChange={onInputChange}
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
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

export default EditCompanyInfoDialog;
