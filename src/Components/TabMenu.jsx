import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const TabMenu = ({ anchorEl, open, onClose, menuItems }) => {
    const navigate = useNavigate();

    const handleItemClick = (path) => {
        onClose();
        navigate(path)
    };

    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={() => handleItemClick(item.path)}>
                    {item.label}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default TabMenu;
