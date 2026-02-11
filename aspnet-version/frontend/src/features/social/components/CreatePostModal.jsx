import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../../auth/AuthContext';
import postService from '../../../services/postService';
import toast from 'react-hot-toast';

const CreatePostModal = ({ show, onHide, onSuccess, editData = null }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    visibility: 'PUBLIC'
  });

  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        description: editData.description || '',
        imageUrl: editData.imageUrl || '',
        visibility: editData.visibility || 'PUBLIC'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        visibility: 'PUBLIC'
      });
    }
  }, [editData, show]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // IMPORTANT: Your Cloudinary Cloud Name is 'dim4t9fyx'
    // and your Unsigned Upload Preset name is 'ml_default'.
    const CLOUD_NAME = 'dim4t9fyx'; 
    const UPLOAD_PRESET = 'ml_default';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    try {
      setUploading(true);
      // Use 'auto' resource type to accept both images and videos
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.secure_url) {
        setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
        toast.success("Upload Successful!");
      } else {
        const errorMsg = data.error?.message || JSON.stringify(data);
        toast.error(`Upload Failed: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('post-image-input').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    try {
      setLoading(true);
      if (editData) {
        await postService.updatePost(editData.postId, {
          ...formData,
          userId: user.id
        });
        toast.success("Post updated successfully!");
      } else {
        await postService.createPost({
          ...formData,
          userId: user.id
        });
        toast.success("Post created successfully!");
      }
      setFormData({ title: '', description: '', imageUrl: '', visibility: 'PUBLIC' });
      onSuccess();
      onHide();
    } catch (error) {
      toast.error(`Failed to ${editData ? 'update' : 'create'} post. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      contentClassName="border-0 shadow-lg"
      style={{ borderRadius: '28px' }}
    >
      <Modal.Header closeButton className="border-0 px-4 pt-4">
        <Modal.Title className="fw-900 fs-4">{editData ? 'Edit Story' : 'Share an Update'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-800 text-slate-400 uppercase letter-spacing-1">Post Title</Form.Label>
            <Form.Control 
              placeholder="Give your post a title..." 
              className="bg-slate-50 border-0 py-3 px-3 rounded-4 fw-600 shadow-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-800 text-slate-400 uppercase letter-spacing-1">What's on your mind?</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              placeholder="Tell your community about your pet's day..." 
              className="bg-slate-50 border-0 py-3 px-3 rounded-4 fw-600 shadow-none"
              style={{ resize: 'none' }}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <Form.Label className="small fw-800 text-slate-400 uppercase letter-spacing-1 mb-0">Media (Image/Video)</Form.Label>
              <Button 
                variant="link" 
                className={`p-0 small fw-800 text-decoration-none ${formData.imageUrl ? 'text-danger' : 'text-primary'}`}
                onClick={() => {
                  if (formData.imageUrl) {
                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                  } else {
                    triggerFileInput();
                  }
                }}
                disabled={uploading}
              >
                {uploading ? <Spinner animation="border" size="sm" className="me-1" /> : (formData.imageUrl ? '✕ Remove Media' : '+ Upload Media')}
              </Button>
              <input 
                type="file" 
                id="post-image-input" 
                className="d-none" 
                accept="image/*,video/*"
                onChange={handleFileChange} 
              />
            </div>
            {/* Hidden field for imageUrl state */}
            <input type="hidden" value={formData.imageUrl} name="imageUrl" />
          </Form.Group>

          {formData.imageUrl && (
            <div className="mb-3">
              <div className="rounded-4 overflow-hidden border border-slate-100 shadow-inner mb-2" style={{ maxHeight: '300px' }}>
                {formData.imageUrl.match(/\.(mp4|webm|mov|mkv)$/i) ? (
                  <video 
                    src={formData.imageUrl} 
                    className="w-100 h-100" 
                    controls
                    style={{ objectFit: 'cover' }} 
                  />
                ) : (
                  <img 
                    src={formData.imageUrl} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }} 
                    alt="Preview"
                    id="image-preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      document.getElementById('image-error').style.display = 'block';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                      document.getElementById('image-error').style.display = 'none';
                    }}
                  />
                )}
              </div>
              <div id="image-error" className="text-danger small fw-600 px-2" style={{ display: 'none' }}>
                ⚠️ Not a direct image link.
              </div>
            </div>
          )}

          <Form.Group className="mb-4">
             <Form.Label className="small fw-800 text-slate-400 uppercase letter-spacing-1">Privacy</Form.Label>
             <Form.Select 
               className="bg-slate-50 border-0 py-3 px-3 rounded-4 fw-600 shadow-none"
               value={formData.visibility}
               onChange={(e) => setFormData({...formData, visibility: e.target.value})}
             >
                <option value="PUBLIC">Public - Everyone can see</option>
                <option value="CONNECTIONS">Connections Only</option>
             </Form.Select>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 py-3 rounded-pill fw-800 fs-5 btn-primary-pet border-0 shadow-sm"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Publish Post'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
