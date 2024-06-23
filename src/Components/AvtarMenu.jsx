import { Logout } from '@mui/icons-material';
import { Avatar, Divider, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { useState } from 'react';

const AvtarMenu = ({ userName, LogoutFunction }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Tooltip title="Account">
                <Avatar onClick={handleMenu} sx={{
                    mr: {
                        xs: '0',
                        sm: '5px',
                        md: '15px',
                        lg: '15px'
                    },
                    cursor: "pointer"
                }}>
                    {userName.charAt(0).toUpperCase()}
                </Avatar>
            </Tooltip>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar onClick={handleMenu} sx={{ mr: "15px", cursor: "pointer" }}>
                        {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    {userName}
                </MenuItem>
                <Divider />
                <MenuItem onClick={LogoutFunction}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
};

export default AvtarMenu;
