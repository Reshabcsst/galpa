import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import close from '../../Assets/Close.png';
import Forms from './Forms';
import Notification from '../Home/Components/PopNotification/Notification';

const SignIn = ({ open, handleClose, ServerURL }) => {
    const [activeTab, setActiveTab] = useState('signIn');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationText, setNotificationText] = useState('');
    const [notificationColor, setNotificationColor] = useState('');

    const handleNotification = (message, color) => {
        setNotificationText(message);
        setNotificationColor(color);
        setNotificationOpen(true);
    };

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotificationOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                keepMounted
                sx={{ '& .MuiDialog-paper': { width: '80%' } }}
                maxWidth="xs"
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle sx={{ background: "rgba(138, 7, 240, 1)", padding: ".1rem", width: "100%", display: "flex", justifyContent: "center", position: "relative" }}>
                    <div>
                        <h2 style={{ color: "white", fontSize: "20px", fontWeight: "472" }}>Welcome Back</h2>
                        <img onClick={() => { handleClose() }} style={{ position: "absolute", right: "1%", top: "0", height: "30px", width: "27px", cursor: "pointer" }} src={close} alt="Close" />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Forms ServerURL={ServerURL} activeTab={activeTab} setActiveTab={setActiveTab} handleNotification={handleNotification} handleClose={handleClose} />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Notification
                text={notificationText}
                color={notificationColor}
                open={notificationOpen}
                handleClose={handleNotificationClose}
            />
        </div>
    );
};

export default SignIn;
