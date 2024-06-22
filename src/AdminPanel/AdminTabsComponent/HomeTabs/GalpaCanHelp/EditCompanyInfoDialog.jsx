import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EditCompanyInfoDialog = ({ open, onClose, companyInfo, onSave, onInputChange }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{companyInfo && companyInfo.id ? 'Edit Company Info' : 'Add Company Info'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="subheading"
                    label="Subheading"
                    type="text"
                    fullWidth
                    value={companyInfo ? companyInfo.subheading : ''}
                    onChange={onInputChange}
                />
                <TextField
                    margin="dense"
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    fullWidth
                    value={companyInfo ? companyInfo.phoneNumber : ''}
                    onChange={onInputChange}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={companyInfo ? companyInfo.email : ''}
                    onChange={onInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCompanyInfoDialog;
