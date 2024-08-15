import React, { useEffect, useState } from 'react';
import Notification from '../Components/Home/Components/PopNotification/Notification';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckIfUserTokenIsValid = ({ ServerURL }) => {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationText, setNotificationText] = useState('');
    const [notificationColor, setNotificationColor] = useState('');
    const token = JSON.parse(window.localStorage.getItem("AdminData"));
    const location = useLocation();
    const navigate = useNavigate();

    const path = location.pathname.startsWith('/admin');

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await fetch(`${ServerURL}/api/Auth/check`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token.token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 401) {
                    setNotificationOpen(true);
                    setNotificationText('Session expired, please log in again');
                    setNotificationColor('error');
                } else if (response.ok) {
                    setNotificationOpen(false);
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };

        if (path) {
            checkToken();
        }
    }, [path, ServerURL, token, navigate]);

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

export default CheckIfUserTokenIsValid;
