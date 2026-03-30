const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Product',
  'Legal',
  'Support',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;
const MOBILE_REGEX = /^\d{10,15}$/;

function validateSubmission(submission) {
  const errors = [];

  // Full Name validation
  if (!submission.fullName || !submission.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required.' });
  } else if (submission.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters.' });
  } else if (submission.fullName.trim().length > 50) {
    errors.push({ field: 'fullName', message: 'Full name must not exceed 50 characters.' });
  } else if (!NAME_REGEX.test(submission.fullName.trim())) {
    errors.push({ field: 'fullName', message: 'Full name must contain only letters and spaces.' });
  }

  // Email validation
  if (!submission.email || !submission.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else if (!EMAIL_REGEX.test(submission.email.trim())) {
    errors.push({ field: 'email', message: 'Invalid email address.' });
  }

  // Mobile validation
  if (!submission.mobile || !submission.mobile.trim()) {
    errors.push({ field: 'mobile', message: 'Mobile number is required.' });
  } else if (!MOBILE_REGEX.test(submission.mobile.trim())) {
    errors.push({ field: 'mobile', message: 'Mobile number must be 10 to 15 digits.' });
  }

  // Department validation
  if (!submission.department || !submission.department.trim()) {
    errors.push({ field: 'department', message: 'Department is required.' });
  } else if (!ALLOWED_DEPARTMENTS.includes(submission.department.trim())) {
    errors.push({ field: 'department', message: 'Please select a valid department.' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default validateSubmission;
export { ALLOWED_DEPARTMENTS };