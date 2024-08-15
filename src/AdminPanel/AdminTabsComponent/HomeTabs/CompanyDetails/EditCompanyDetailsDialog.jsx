import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const EditCompanyDetailsDialog = ({ open, onClose, companyDetails, onSave, onInputChange }) => {
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!companyDetails.companyBio) newErrors.companyBio = 'Company Bio is required';
        if (!companyDetails.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
        if (!companyDetails.email) newErrors.email = 'Email is required';
        if (!companyDetails.address) newErrors.address = 'Address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{companyDetails && companyDetails.id ? 'Edit Company Details' : 'Add Company Details'}</DialogTitle>
            <DialogContent>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="companyBio">Company Bio</label>
                        <input
                            type="text"
                            id="companyBio"
                            placeholder='Company Bio'
                            name="companyBio"
                            value={companyDetails ? companyDetails.companyBio : ''}
                            onChange={onInputChange}
                        />
                        {errors.companyBio && <p style={{ color: 'red' }}>{errors.companyBio}</p>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder='Phone Number'
                            name="phoneNumber"
                            value={companyDetails ? companyDetails.phoneNumber : ''}
                            onChange={onInputChange}
                        />
                        {errors.phoneNumber && <p style={{ color: 'red' }}>{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            placeholder='Email'
                            name="email"
                            value={companyDetails ? companyDetails.email : ''}
                            onChange={onInputChange}
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            placeholder='Address'
                            name="address"
                            value={companyDetails ? companyDetails.address : ''}
                            onChange={onInputChange}
                        />
                        {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
                    </div>
                    <div>
                        <label htmlFor="facebookLink">Facebook Link</label>
                        <input
                            type="text"
                            id="facebookLink"
                            placeholder='Facebook Link'
                            name="facebookLink"
                            value={companyDetails ? companyDetails.facebookLink : ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="twitterLink">Twitter Link</label>
                        <input
                            type="text"
                            id="twitterLink"
                            placeholder='Twitter Link'
                            name="twitterLink"
                            value={companyDetails ? companyDetails.twitterLink : ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="instagramLink">Instagram Link</label>
                        <input
                            type="text"
                            id="instagramLink"
                            placeholder='Instagram Link'
                            name="instagramLink"
                            value={companyDetails ? companyDetails.instagramLink : ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="linkedInLink">LinkedIn Link</label>
                        <input
                            type="text"
                            id="linkedInLink"
                            placeholder='LinkedIn Link'
                            name="linkedInLink"
                            value={companyDetails ? companyDetails.linkedInLink : ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="youtubeLink">YouTube Link</label>
                        <input
                            type="text"
                            id="youtubeLink"
                            placeholder='YouTube Link'
                            name="youtubeLink"
                            value={companyDetails ? companyDetails.youtubeLink : ''}
                            onChange={onInputChange}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button className='save' onClick={handleSave}>Save</button>
                <button className='cancel' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCompanyDetailsDialog;
