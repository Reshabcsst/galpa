import React, { useState } from 'react';
import './Signin.scss';
import Notification from '../Components/Home/Components/PopNotification/Notification';
import RegistrationForms from './RegistrationForms';

const AddAdmin = ({ ServerURL }) => {
    const [activeTab, setActiveTab] = useState('signUp');
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
        <div className='admin_form'>
            <RegistrationForms
                ServerURL={ServerURL}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleNotification={handleNotification}
            />
            <Notification
                text={notificationText}
                color={notificationColor}
                open={notificationOpen}
                handleClose={handleNotificationClose}
            />
        </div>
    );
};

export default AddAdmin;
