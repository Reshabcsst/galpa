import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const DeleteCarouselDialog = ({ open, onClose, onDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Carousel</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to delete this carousel?</p>
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={onDelete}>Yes</button>
                <button className='add' onClick={onClose}>No</button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCarouselDialog;
