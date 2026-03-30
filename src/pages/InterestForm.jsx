import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import validateSubmission, { ALLOWED_DEPARTMENTS } from '../services/Validation';
import SubmissionStore from '../services/SubmissionStore';

function InterestForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (banner && banner.type === 'success') {
      const timer = setTimeout(() => {
        setBanner(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const trimmed = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department.trim(),
    };

    const result = validateSubmission(trimmed);

    if (!result.valid) {
      const errors = {};
      result.errors.forEach((err) => {
        if (!errors[err.field]) {
          errors[err.field] = err.message;
        }
      });
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      SubmissionStore.add(trimmed);
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        department: '',
      });
      setFieldErrors({});
      setBanner({
        type: 'success',
        message: '🎉 Your interest has been submitted successfully!',
      });
    } catch (err) {
      if (err.code === 'DUPLICATE_ERROR') {
        setFieldErrors({ email: err.message });
        setBanner({
          type: 'error',
          message: 'A submission with this email already exists.',
        });
      } else {
        setBanner({
          type: 'error',
          message: err.message || 'Something went wrong. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-card__title">Express Your Interest</h1>
        <p className="form-card__subtitle">
          Fill out the form below to let us know which department you're
          interested in joining.
        </p>

        {banner && (
          <div
            className={`form-banner ${
              banner.type === 'success'
                ? 'form-banner--success'
                : 'form-banner--error'
            }`}
          >
            {banner.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-group__label" htmlFor="fullName">
              Full Name<span className="form-group__required">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`form-group__input${
                fieldErrors.fullName ? ' form-group__input--error' : ''
              }`}
              placeholder="e.g. Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
            {fieldErrors.fullName && (
              <span className="form-group__error">{fieldErrors.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="email">
              Email<span className="form-group__required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-group__input${
                fieldErrors.email ? ' form-group__input--error' : ''
              }`}
              placeholder="e.g. jane@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <span className="form-group__error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="mobile">
              Mobile Number<span className="form-group__required">*</span>
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              className={`form-group__input${
                fieldErrors.mobile ? ' form-group__input--error' : ''
              }`}
              placeholder="e.g. 1234567890"
              value={formData.mobile}
              onChange={handleChange}
            />
            {fieldErrors.mobile && (
              <span className="form-group__error">{fieldErrors.mobile}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="department">
              Department<span className="form-group__required">*</span>
            </label>
            <select
              id="department"
              name="department"
              className={`form-group__select${
                fieldErrors.department ? ' form-group__select--error' : ''
              }`}
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select a department</option>
              {ALLOWED_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {fieldErrors.department && (
              <span className="form-group__error">
                {fieldErrors.department}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="form-card__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Interest'}
          </button>
        </form>

        <p className="text-center mt-lg">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}

export default InterestForm;