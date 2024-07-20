import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const EditBlogPostDialog = ({ open, onClose, blogPost, onSave, onFieldChange, onFileChange, ServerURL }) => {
    const [previewUrls, setPreviewUrls] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const newPreviewUrls = {};
        const fields = ['image', 'authorPic', 'bookImg'];
        fields.forEach(field => {
            if (blogPost && blogPost[field]) {
                if (blogPost[field] instanceof File) {
                    const url = URL.createObjectURL(blogPost[field]);
                    newPreviewUrls[field] = url;
                } else {
                    const url = `${ServerURL}${blogPost[field]}`;
                    newPreviewUrls[field] = url;
                }
            }
        });
        setPreviewUrls(newPreviewUrls);
    }, [blogPost]);

    const handleImageChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrls(prev => ({ ...prev, [field]: url }));
            onFileChange(e);
        } else {
            setPreviewUrls(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!blogPost.heading) newErrors.heading = 'Heading is required';
        if (!blogPost.details) newErrors.details = 'Details are required';
        if (!blogPost.author) newErrors.author = 'Author is required';
        if (!blogPost.date) newErrors.date = 'Date is required';
        if (!blogPost.postedBy) newErrors.postedBy = 'Posted By is required';
        if (!blogPost.authorPic) newErrors.authorPic = 'Author Picture is required';
        if (!blogPost.bookImg) newErrors.bookImg = 'Book Image is required';
        if (!blogPost.comments && blogPost.comments !== 0) newErrors.comments = 'Comments are required';
        if (!blogPost.image) newErrors.image = 'Image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (blogPost && !blogPost.id && !validateFields()) {
            return;
        }
        onSave();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{blogPost && blogPost.id ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle>
            <DialogContent style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <label htmlFor="heading">Heading</label>
                        <input
                            type="text"
                            id="heading"
                            placeholder='Heading'
                            name="heading"
                            value={blogPost ? blogPost.heading : ''}
                            onChange={onFieldChange}
                        />
                        {errors.heading && <p style={{ color: 'red' }}>{errors.heading}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="details">Details</label>
                        <textarea
                            id="details"
                            placeholder='Details'
                            name="details"
                            value={blogPost ? blogPost.details : ''}
                            onChange={onFieldChange}
                            rows="4"
                            style={{ width: '100%' }}
                        />
                        {errors.details && <p style={{ color: 'red' }}>{errors.details}</p>}
                    </div>
                    <div>
                        <label htmlFor="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            placeholder='Author'
                            name="author"
                            value={blogPost ? blogPost.author : ''}
                            onChange={onFieldChange}
                        />
                        {errors.author && <p style={{ color: 'red' }}>{errors.author}</p>}
                    </div>
                    <div>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={blogPost ? blogPost.date : ''}
                            onChange={onFieldChange}
                        />
                        {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
                    </div>
                    <div>
                        <label htmlFor="postedBy">Posted By</label>
                        <input
                            type="text"
                            id="postedBy"
                            placeholder='Posted By'
                            name="postedBy"
                            value={blogPost ? blogPost.postedBy : ''}
                            onChange={onFieldChange}
                        />
                        {errors.postedBy && <p style={{ color: 'red' }}>{errors.postedBy}</p>}
                    </div>
                    <div>
                        <label htmlFor="authorPic">Author Picture</label>
                        <input
                            type="file"
                            id="authorPic"
                            name="authorPic"
                            onChange={(e) => handleImageChange(e, 'authorPic')}
                        />
                        {errors.authorPic && <p style={{ color: 'red' }}>{errors.authorPic}</p>}
                    </div>
                    <div>
                        <label htmlFor="bookImg">Book Image</label>
                        <input
                            type="file"
                            id="bookImg"
                            name="bookImg"
                            onChange={(e) => handleImageChange(e, 'bookImg')}
                        />
                        {errors.bookImg && <p style={{ color: 'red' }}>{errors.bookImg}</p>}
                    </div>
                    <div>
                        <label htmlFor="comments">Comments</label>
                        <input
                            type="number"
                            id="comments"
                            placeholder='Comments'
                            name="comments"
                            value={blogPost ? blogPost.comments : ''}
                            onChange={onFieldChange}
                        />
                        {errors.comments && <p style={{ color: 'red' }}>{errors.comments}</p>}
                    </div>
                    <div className="custom-file-input">
                        <label style={{ marginRight: ".5rem" }} htmlFor="image">Choose image</label>
                        <button className="button">Choose File</button>
                        <input
                            margin="dense"
                            id="image"
                            name="image"
                            type="file"
                            onChange={(e) => handleImageChange(e, 'image')}
                        />
                    </div>
                    {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
                </div>
                <div style={{ flex: 1 }}>
                    {previewUrls.image && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <img src={previewUrls.image} alt="Main Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                        </div>
                    )}
                    {previewUrls.authorPic && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <img src={previewUrls.authorPic} alt="Author Pic Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                        </div>
                    )}
                    {previewUrls.bookImg && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <img src={previewUrls.bookImg} alt="Book Img Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <button className='add' onClick={handleSave}>Save</button>
                <button className='add' onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBlogPostDialog;
