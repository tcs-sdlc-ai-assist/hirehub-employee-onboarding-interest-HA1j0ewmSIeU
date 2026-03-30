import { useState, useEffect } from 'react';
import SubmissionStore from '../services/SubmissionStore';
import validateSubmission, { ALLOWED_DEPARTMENTS } from '../services/Validation';

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });
  const [editErrors, setEditErrors] = useState({});
  const [editBanner, setEditBanner] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  function loadSubmissions() {
    setSubmissions(SubmissionStore.getAll());
  }

  function getUniqueDepartments() {
    const departments = new Set(submissions.map((s) => s.department));
    return departments.size;
  }

  function getLatestSubmission() {
    if (submissions.length === 0) return 'N/A';
    const sorted = [...submissions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const latest = sorted[0];
    return latest.fullName;
  }

  function getFilteredSubmissions() {
    if (!searchTerm.trim()) return submissions;
    const term = searchTerm.toLowerCase();
    return submissions.filter(
      (s) =>
        s.fullName.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.department.toLowerCase().includes(term) ||
        s.mobile.includes(term)
    );
  }

  function handleEditClick(submission) {
    setEditData({
      fullName: submission.fullName,
      email: submission.email,
      mobile: submission.mobile,
      department: submission.department,
    });
    setEditErrors({});
    setEditBanner(null);
    setEditModal(submission.email);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));

    if (editErrors[name]) {
      setEditErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleEditSave(e) {
    e.preventDefault();
    setEditErrors({});
    setEditBanner(null);

    const trimmed = {
      fullName: editData.fullName.trim(),
      email: editData.email.trim(),
      mobile: editData.mobile.trim(),
      department: editData.department.trim(),
    };

    const result = validateSubmission(trimmed);

    if (!result.valid) {
      const errors = {};
      result.errors.forEach((err) => {
        if (!errors[err.field]) {
          errors[err.field] = err.message;
        }
      });
      setEditErrors(errors);
      return;
    }

    try {
      SubmissionStore.update(editModal, {
        fullName: trimmed.fullName,
        mobile: trimmed.mobile,
        department: trimmed.department,
      });
      loadSubmissions();
      setEditModal(null);
    } catch (err) {
      setEditBanner({
        type: 'error',
        message: err.message || 'Failed to update submission.',
      });
    }
  }

  function handleDeleteClick(submission) {
    setDeleteDialog(submission.email);
  }

  function handleDeleteConfirm() {
    try {
      SubmissionStore.delete(deleteDialog);
      loadSubmissions();
      setDeleteDialog(null);
    } catch (err) {
      setDeleteDialog(null);
    }
  }

  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }

  const filtered = getFilteredSubmissions();

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        {/* Header */}
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Welcome, Admin 👋</h1>
            <p className="dashboard__subtitle">
              Manage all candidate submissions from the dashboard below.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--primary">📋</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{submissions.length}</span>
              <span className="stat-card__label">Total Submissions</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--success">🏢</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{getUniqueDepartments()}</span>
              <span className="stat-card__label">Departments</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--secondary">🕐</div>
            <div className="stat-card__info">
              <span className="stat-card__value truncate">{getLatestSubmission()}</span>
              <span className="stat-card__label">Latest Submission</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="dashboard__table-wrapper">
          <div className="dashboard__table-header">
            <h2 className="dashboard__table-title">All Submissions</h2>
            <input
              type="text"
              className="dashboard__search"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="dashboard__table-empty">
              <div className="dashboard__table-empty-icon">📭</div>
              <p>No submissions yet.</p>
            </div>
          ) : (
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((submission) => (
                  <tr key={submission.email}>
                    <td>{submission.fullName}</td>
                    <td>{submission.email}</td>
                    <td>{submission.mobile}</td>
                    <td>
                      <span className="badge">{submission.department}</span>
                    </td>
                    <td>{formatDate(submission.createdAt)}</td>
                    <td>
                      <div className="dashboard__actions">
                        <button
                          className="dashboard__action-btn dashboard__action-btn--edit"
                          onClick={() => handleEditClick(submission)}
                        >
                          Edit
                        </button>
                        <button
                          className="dashboard__action-btn dashboard__action-btn--delete"
                          onClick={() => handleDeleteClick(submission)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Edit Submission</h3>
              <button
                className="modal__close"
                onClick={() => setEditModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal__body">
              {editBanner && (
                <div
                  className={`form-banner ${
                    editBanner.type === 'success'
                      ? 'form-banner--success'
                      : 'form-banner--error'
                  }`}
                >
                  {editBanner.message}
                </div>
              )}

              <form onSubmit={handleEditSave} noValidate>
                <div className="form-group">
                  <label className="form-group__label" htmlFor="edit-fullName">
                    Full Name<span className="form-group__required">*</span>
                  </label>
                  <input
                    id="edit-fullName"
                    name="fullName"
                    type="text"
                    className={`form-group__input${
                      editErrors.fullName ? ' form-group__input--error' : ''
                    }`}
                    value={editData.fullName}
                    onChange={handleEditChange}
                  />
                  {editErrors.fullName && (
                    <span className="form-group__error">
                      {editErrors.fullName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-group__label" htmlFor="edit-email">
                    Email
                  </label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    className="form-group__input"
                    value={editData.email}
                    readOnly
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-group__label" htmlFor="edit-mobile">
                    Mobile Number<span className="form-group__required">*</span>
                  </label>
                  <input
                    id="edit-mobile"
                    name="mobile"
                    type="text"
                    className={`form-group__input${
                      editErrors.mobile ? ' form-group__input--error' : ''
                    }`}
                    value={editData.mobile}
                    onChange={handleEditChange}
                  />
                  {editErrors.mobile && (
                    <span className="form-group__error">
                      {editErrors.mobile}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-group__label" htmlFor="edit-department">
                    Department<span className="form-group__required">*</span>
                  </label>
                  <select
                    id="edit-department"
                    name="department"
                    className={`form-group__select${
                      editErrors.department ? ' form-group__select--error' : ''
                    }`}
                    value={editData.department}
                    onChange={handleEditChange}
                  >
                    <option value="">Select a department</option>
                    {ALLOWED_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {editErrors.department && (
                    <span className="form-group__error">
                      {editErrors.department}
                    </span>
                  )}
                </div>

                <div className="modal__footer" style={{ padding: 0, borderTop: 'none' }}>
                  <button
                    type="button"
                    className="modal__btn modal__btn--cancel"
                    onClick={() => setEditModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal__btn modal__btn--confirm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="modal-overlay" onClick={() => setDeleteDialog(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Confirm Deletion</h3>
              <button
                className="modal__close"
                onClick={() => setDeleteDialog(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal__body">
              <div className="confirm-dialog__icon">⚠️</div>
              <p className="confirm-dialog__message">
                Are you sure you want to delete the submission for{' '}
                <strong>{deleteDialog}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal__footer">
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setDeleteDialog(null)}
              >
                Cancel
              </button>
              <button
                className="modal__btn modal__btn--danger"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;