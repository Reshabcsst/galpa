import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import close from '../../Assets/Close.png';
import BookPrintDetails from './BookPrintDetails';

const Bookprint = ({ open, handleClose }) => {
    return (
        <Dialog
            open={open}
            keepMounted
            maxWidth="lg"
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{ background: "rgba(138, 7, 240, 1)", padding: ".1rem", width: "100%", display: "flex", justifyContent: "center", position: "relative" }}>
                <div>
                    <h2 style={{ color: "white", fontSize: "20px", fontWeight: "472" }}>Book printing</h2>
                    <img onClick={() => { handleClose() }} style={{ position: "absolute", right: "1%", top: "0", height: "30px", width: "27px", cursor: "pointer" }} src={close} alt="Close" />
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    <BookPrintDetails />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
};

export default Bookprint;
