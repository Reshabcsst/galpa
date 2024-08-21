import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';

const EditHomeCardsDialog = ({ open, onClose, card, onSave, onFieldChange }) => {
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!card.cardTitle1) newErrors.cardTitle1 = 'Card Title1 is required';
        if (!card.text1) newErrors.text1 = 'Text1 is required';
        if (!card.cardTitle2) newErrors.cardTitle1 = 'Card Title2 is required';
        if (!card.text2) newErrors.text1 = 'Text2 is required';
        if (!card.cardTitle3) newErrors.cardTitle1 = 'Card Title3 is required';
        if (!card.text3) newErrors.text1 = 'Text3 is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (card && !card.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{card && card.id ? 'Edit card' : 'Add card'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="cardTitle1">Card Title1</label>
                        <input
                            type="text"
                            id="cardTitle1"
                            placeholder='Card Title1'
                            name="cardTitle1"
                            value={card ? card.cardTitle1 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.cardTitle1 && <p style={{ color: 'red' }}>{errors.cardTitle1}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="text1">Text1</label>
                        <input
                            type="text"
                            id="text1"
                            placeholder='Text1'
                            name="text1"
                            value={card ? card.text1 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.text1 && <p style={{ color: 'red' }}>{errors.text1}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="cardTitle2">Card Title2</label>
                        <input
                            type="text"
                            id="cardTitle2"
                            placeholder='Card Title2'
                            name="cardTitle2"
                            value={card ? card.cardTitle2 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.cardTitle2 && <p style={{ color: 'red' }}>{errors.cardTitle2}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="text2">Text2</label>
                        <input
                            type="text"
                            id="text2"
                            placeholder='Text2'
                            name="text2"
                            value={card ? card.text2 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.text2 && <p style={{ color: 'red' }}>{errors.text2}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="cardTitle3">Card Title3</label>
                        <input
                            type="text"
                            id="cardTitle3"
                            placeholder='Card Title3'
                            name="cardTitle3"
                            value={card ? card.cardTitle3 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.cardTitle3 && <p style={{ color: 'red' }}>{errors.cardTitle3}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="text3">Text3</label>
                        <input
                            type="text"
                            id="text3"
                            placeholder='Text3'
                            name="text3"
                            value={card ? card.text3 : ''}
                            onChange={onFieldChange}
                        />
                        {errors.text3 && <p style={{ color: 'red' }}>{errors.text3}</p>}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={handleSave}>Save</button>
                <button className='add' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditHomeCardsDialog;
