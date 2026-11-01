const API = '/api/students';
const form = document.getElementById('studentForm');
const rows = document.getElementById('studentRows');
const formMessage = document.getElementById('formMessage');
const studentId = document.getElementById('studentId');
const submitButton = document.getElementById('submitButton');
const cancelEdit = document.getElementById('cancelEdit');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function showMessage(message, type = '') {
  formMessage.textContent = message;
  formMessage.className = type;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = payload.errors?.join(', ');
    throw new Error(details || payload.message || `Request failed (${response.status})`);
  }
  return payload;
}

async function checkHealth() {
  const status = document.getElementById('dbStatus');
  try {
    const result = await request('/api/health');
    status.textContent = result.database === 'connected' ? 'Database connected' : 'Database disconnected';
    status.className = `status ${result.database === 'connected' ? 'online' : 'offline'}`;
  } catch {
    status.textContent = 'Server unavailable';
    status.className = 'status offline';
  }
}

async function loadStudents() {
  rows.innerHTML = '<tr><td colspan="5" class="empty">Loading records…</td></tr>';
  try {
    const result = await request(API);
    document.getElementById('recordCount').textContent = `${result.count} record${result.count === 1 ? '' : 's'}`;
    if (!result.data.length) {
      rows.innerHTML = '<tr><td colspan="5" class="empty">No students yet. Add the first record above.</td></tr>';
      return;
    }
    rows.innerHTML = result.data.map(student => `
      <tr>
        <td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.email)}</td>
        <td>${escapeHtml(student.course)}</td><td>${escapeHtml(student.year)}</td>
        <td><div class="actions"><button class="button secondary small" data-edit="${escapeHtml(student._id)}" type="button">Edit</button><button class="button danger small" data-delete="${escapeHtml(student._id)}" type="button">Delete</button></div></td>
      </tr>`).join('');
  } catch (error) {
    document.getElementById('recordCount').textContent = 'Unable to load records';
    rows.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(error.message)}</td></tr>`;
  }
}

function resetForm() {
  form.reset();
  studentId.value = '';
  document.getElementById('formTitle').textContent = 'Add a student';
  submitButton.textContent = 'Add student';
  cancelEdit.classList.add('hidden');
  showMessage('');
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    course: document.getElementById('course').value.trim(),
    year: Number(document.getElementById('year').value)
  };
  const editing = Boolean(studentId.value);
  submitButton.disabled = true;
  showMessage(editing ? 'Updating…' : 'Creating…');
  try {
    await request(editing ? `${API}/${encodeURIComponent(studentId.value)}` : API, {
      method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload)
    });
    resetForm();
    showMessage(editing ? 'Student updated successfully.' : 'Student added successfully.', 'success');
    await loadStudents();
  } catch (error) { showMessage(error.message, 'error'); }
  finally { submitButton.disabled = false; }
});

rows.addEventListener('click', async event => {
  const editButton = event.target.closest('[data-edit]');
  const deleteButton = event.target.closest('[data-delete]');
  if (editButton) {
    try {
      const result = await request(`${API}/${encodeURIComponent(editButton.dataset.edit)}`);
      const student = result.data;
      studentId.value = student._id;
      document.getElementById('name').value = student.name;
      document.getElementById('email').value = student.email;
      document.getElementById('course').value = student.course;
      document.getElementById('year').value = student.year;
      document.getElementById('formTitle').textContent = 'Edit student';
      submitButton.textContent = 'Save changes';
      cancelEdit.classList.remove('hidden');
      showMessage('Editing selected student.');
      document.getElementById('name').focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) { alert(error.message); }
  }
  if (deleteButton) {
    const id = deleteButton.dataset.delete;
    if (!confirm('Delete this student record? This action cannot be undone.')) return;
    deleteButton.disabled = true;
    try { await request(`${API}/${encodeURIComponent(id)}`, { method: 'DELETE' }); await loadStudents(); }
    catch (error) { alert(error.message); deleteButton.disabled = false; }
  }
});

cancelEdit.addEventListener('click', resetForm);
document.getElementById('refreshButton').addEventListener('click', loadStudents);
checkHealth();
loadStudents();
