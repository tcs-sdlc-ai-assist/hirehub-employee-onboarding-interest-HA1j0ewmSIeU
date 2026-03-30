const STORAGE_KEY = 'hirehub_submissions';

class SubmissionStoreError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'SubmissionStoreError';
    this.code = code;
  }
}

function loadSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error('SubmissionStore: Data is not an array, resetting.');
      saveSubmissions([]);
      return [];
    }
    return parsed;
  } catch (e) {
    console.error('SubmissionStore: Corrupted data detected, resetting.', e);
    saveSubmissions([]);
    return [];
  }
}

function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    throw new SubmissionStoreError('Failed to save submissions to localStorage.', 'SAVE_ERROR');
  }
}

const SubmissionStore = {
  getAll() {
    return loadSubmissions();
  },

  add(submission) {
    if (!submission || !submission.email) {
      throw new SubmissionStoreError('Submission must include an email.', 'VALIDATION_ERROR');
    }

    const submissions = loadSubmissions();
    const duplicate = submissions.find(
      (s) => s.email.toLowerCase() === submission.email.toLowerCase()
    );

    if (duplicate) {
      throw new SubmissionStoreError(
        'A submission with this email already exists.',
        'DUPLICATE_ERROR'
      );
    }

    const newSubmission = {
      ...submission,
      createdAt: submission.createdAt || new Date().toISOString(),
    };

    submissions.push(newSubmission);
    saveSubmissions(submissions);
  },

  update(email, updates) {
    if (!email) {
      throw new SubmissionStoreError('Email is required to update a submission.', 'VALIDATION_ERROR');
    }

    const submissions = loadSubmissions();
    const index = submissions.findIndex(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );

    if (index === -1) {
      throw new SubmissionStoreError('Submission not found.', 'NOT_FOUND_ERROR');
    }

    const { email: _ignoredEmail, ...safeUpdates } = updates || {};

    submissions[index] = {
      ...submissions[index],
      ...safeUpdates,
    };

    saveSubmissions(submissions);
  },

  delete(email) {
    if (!email) {
      throw new SubmissionStoreError('Email is required to delete a submission.', 'VALIDATION_ERROR');
    }

    const submissions = loadSubmissions();
    const filtered = submissions.filter(
      (s) => s.email.toLowerCase() !== email.toLowerCase()
    );

    if (filtered.length === submissions.length) {
      throw new SubmissionStoreError('Submission not found.', 'NOT_FOUND_ERROR');
    }

    saveSubmissions(filtered);
  },

  reset() {
    saveSubmissions([]);
  },
};

export default SubmissionStore;
export { SubmissionStoreError };