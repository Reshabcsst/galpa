import React, { useEffect, useState } from 'react';
import Notification from '../Components/Home/Components/PopNotification/Notification';

const CheckIfServerIsRunning = ({ ServerURL }) => {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationText, setNotificationText] = useState('');
    const [notificationColor, setNotificationColor] = useState('');

    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const response = await fetch(`${ServerURL}/api/Auth/test`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 404) {
                    setNotificationOpen(true);
                    setNotificationText('Server is currently down, please visit us later.');
                    setNotificationColor('error');
                } else if (response.ok) {
                    setNotificationOpen(false);
                } else {
                    // Handle other HTTP errors
                    setNotificationOpen(true);
                    setNotificationText('Unexpected server response, please try again later.');
                    setNotificationColor('error');
                }
            } catch (error) {
                console.error('Error checking server:', error);
                setNotificationOpen(true);
                setNotificationText('Unable to reach the server. Please check your internet connection or try again later.');
                setNotificationColor('error');
            }
        };

        checkServerStatus();
    }, [ServerURL]);

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationOpen(false);
    };

    return (
        <div>
            <Notification
                text={notificationText}
                color={notificationColor}
                open={notificationOpen}
                handleClose={handleNotificationClose}
            />
        </div>
    );
};

export default CheckIfServerIsRunning;
