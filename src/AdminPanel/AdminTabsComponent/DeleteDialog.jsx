import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const DeleteDialog = ({ open, onClose, onDelete, Data, Name }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete {Name}</DialogTitle>
            <DialogContent>
                <p className='deletion_message'>Are you sure you want to delete this {Name} <span>ID : {Data}</span> ?</p>
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={onDelete}>Yes</button>
                <button className='add' onClick={onClose}>No</button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
