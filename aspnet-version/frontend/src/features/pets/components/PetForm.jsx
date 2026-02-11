import React from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const PetForm = ({ initialValues, onSubmit, submitLabel = 'Save Pet', isLoading = false }) => {
  const schema = Yup.object().shape({
    petName: Yup.string().required('Pet name is required'),
    species: Yup.string().oneOf(['DOG', 'CAT', 'BIRD', 'OTHER'], 'Select a valid species').required('Species is required'),
    breed: Yup.string(),
    age: Yup.number().min(0, 'Age cannot be negative').integer().required('Age is required'),
    imageUrl: Yup.string().url('Invalid URL'),
  });

  const defaultValues = {
    petName: "",
    species: "",
    breed: '',
    age: '',
    imageUrl: '',
    ...initialValues,
  };

  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = async (e, setFieldValue) => {
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
      setIsUploading(true);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.secure_url) {
        setFieldValue('imageUrl', data.secure_url);
        toast.success("Image uploaded successfully!");
      } else {
        const errorMsg = data.error?.message || JSON.stringify(data);
        toast.error(`Upload Failed: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Upload error:", error);
      toast.error("Error uploading image. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('pet-image-input').click();
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={schema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-600 mb-1 small d-block text-start">Pet Name</Form.Label>
            <Form.Control
              type="text"
              name="petName"
              placeholder="e.g. Max, Bella"
              value={values.petName}
              onChange={handleChange}
              isInvalid={touched.petName && !!errors.petName}
              style={{ padding: '10px 14px' }}
            />
            <Form.Control.Feedback type="invalid">{errors.petName}</Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-600 mb-1 small d-block text-start">Species</Form.Label>
                <Form.Select
                  name="species"
                  value={values.species}
                  onChange={handleChange}
                  isInvalid={touched.species && !!errors.species}
                  style={{ padding: '10px 14px' }}
                >
                  <option value="DOG">Dog</option>
                  <option value="CAT">Cat</option>
                  <option value="BIRD">Bird</option>
                  <option value="OTHER">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-600 mb-1 small d-block text-start">Age (Years)</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={values.age}
                  onChange={handleChange}
                  isInvalid={touched.age && !!errors.age}
                  style={{ padding: '10px 14px' }}
                />
                <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-600 mb-1 small d-block text-start">Breed (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="breed"
              placeholder="e.g. Golden Retriever"
              value={values.breed}
              onChange={handleChange}
              isInvalid={touched.breed && !!errors.breed}
              style={{ padding: '10px 14px' }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <Form.Label className="fw-600 small mb-0">Photo</Form.Label>
              <Button 
                variant="link" 
                className={`p-0 small fw-700 text-decoration-none ${values.imageUrl ? 'text-danger' : ''}`}
                style={{ color: values.imageUrl ? 'var(--bs-danger)' : 'var(--brand-primary)' }}
                onClick={() => {
                  if (values.imageUrl) {
                    setFieldValue('imageUrl', '');
                  } else {
                    triggerFileInput();
                  }
                }}
                disabled={isUploading}
              >
                {isUploading ? <Spinner animation="border" size="sm" className="me-1" /> : (values.imageUrl ? '✕ Remove Photo' : '+ Upload Photo')}
              </Button>
              <input 
                type="file" 
                id="pet-image-input" 
                className="d-none" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, setFieldValue)} 
              />
            </div>
            {values.imageUrl && (
              <div className="mt-2 text-center">
                <div className="rounded-3 overflow-hidden border border-slate-100 shadow-sm d-inline-block" style={{ width: '100px', height: '100px' }}>
                  <img src={values.imageUrl} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="Pet" />
                </div>
              </div>
            )}
            {/* Hidden field for imageUrl state */}
            <Form.Control
              type="hidden"
              name="imageUrl"
              value={values.imageUrl}
            />
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 btn-primary-pet mb-2" 
            style={{ padding: '12px' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default PetForm;
