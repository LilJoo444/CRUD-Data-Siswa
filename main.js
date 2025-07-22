// DOM Elements
const navForm = document.getElementById('nav-form');
const navTable = document.getElementById('nav-table');
const formSection = document.getElementById('form-section');
const tableSection = document.getElementById('table-section');
const studentForm = document.getElementById('student-form');
const studentData = document.getElementById('student-data');
const noData = document.getElementById('no-data');
const editModal = document.getElementById('edit-modal');
const closeModal = document.getElementById('close-modal');
const cancelEdit = document.getElementById('cancel-edit');
const editForm = document.getElementById('edit-form');

// Store student data
let students = JSON.parse(localStorage.getItem('students')) || [];

// Navigation
navForm.addEventListener('click', () => {
    formSection.classList.remove('hidden');
    tableSection.classList.add('hidden');
    navForm.classList.add('active');
    navTable.classList.remove('active');
});

navTable.addEventListener('click', () => {
    formSection.classList.add('hidden');
    tableSection.classList.remove('hidden');
    navForm.classList.remove('active');
    navTable.classList.add('active');
    renderStudentData();
});

// Form submission
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const student = {
        kode: document.getElementById('kode').value,
        nama: document.getElementById('nama').value,
        alamat: document.getElementById('alamat').value,
        tanggal_lahir: document.getElementById('tanggal_lahir').value,
        telepon: document.getElementById('telepon').value,
        jurusan: document.getElementById('jurusan').value,
        jenis_kelamin: document.getElementById('jenis_kelamin').value
    };

    students.push(student);
    saveData();
    studentForm.reset();

    // Show success message
    showAlert('Data siswa berhasil disimpan!', 'success');
});

// Edit form submission
editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const index = document.getElementById('edit-index').value;

    students[index] = {
        kode: document.getElementById('edit-kode').value,
        nama: document.getElementById('edit-nama').value,
        alamat: document.getElementById('edit-alamat').value,
        tanggal_lahir: document.getElementById('edit-tanggal_lahir').value,
        telepon: document.getElementById('edit-telepon').value,
        jurusan: document.getElementById('edit-jurusan').value,
        jenis_kelamin: document.getElementById('edit-jenis_kelamin').value
    };

    saveData();
    closeEditModal();
    renderStudentData();

    // Show success message
    showAlert('Data siswa berhasil diperbarui!', 'success');
});

// Close modal
closeModal.addEventListener('click', closeEditModal);
cancelEdit.addEventListener('click', closeEditModal);

// Render student data
function renderStudentData() {
    if (students.length === 0) {
        studentData.innerHTML = '';
        noData.classList.remove('hidden');
        return;
    }

    noData.classList.add('hidden');
    studentData.innerHTML = students.map((student, index) => `
        <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors">
            <td class="py-3 px-4 border-b border-gray-200">${student.kode}</td>
            <td class="py-3 px-4 border-b border-gray-200">${student.nama}</td>
            <td class="py-3 px-4 border-b border-gray-200">${student.alamat}</td>
            <td class="py-3 px-4 border-b border-gray-200">${formatDate(student.tanggal_lahir)}</td>
            <td class="py-3 px-4 border-b border-gray-200">${student.telepon}</td>
            <td class="py-3 px-4 border-b border-gray-200">${student.jurusan || ''}</td>
            <td class="py-3 px-4 border-b border-gray-200">${student.jenis_kelamin || ''}</td>
            <td class="py-3 px-4 border-b border-gray-200 text-center">
                <button onclick="editStudent(${index})" class="btn-warning bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md mr-2">
                    Edit
                </button>
                <button onclick="deleteStudent(${index})" class="btn-danger bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">
                    Hapus
                </button>
            </td>
        </tr>
    `).join('');
}

// Edit student
function editStudent(index) {
    const student = students[index];

    document.getElementById('edit-index').value = index;
    document.getElementById('edit-kode').value = student.kode;
    document.getElementById('edit-nama').value = student.nama;
    document.getElementById('edit-alamat').value = student.alamat;
    document.getElementById('edit-tanggal_lahir').value = student.tanggal_lahir;
    document.getElementById('edit-telepon').value = student.telepon;
    document.getElementById('edit-jurusan').value = student.jurusan || '';
    document.getElementById('edit-jenis_kelamin').value = student.jenis_kelamin || '';

    openEditModal();
}

// Delete student
function deleteStudent(index) {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
        students.splice(index, 1);
        saveData();
        renderStudentData();
        showAlert('Data siswa berhasil dihapus!', 'danger');
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Format date
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Modal functions
function openEditModal() {
    editModal.classList.remove('hide');
    editModal.classList.add('show');
}

function closeEditModal() {
    editModal.classList.remove('show');
    editModal.classList.add('hide');
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50 flex items-center`;

    // Tambahkan tombol close (x)
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'ml-4 text-xl font-bold focus:outline-none hover:text-gray-300';
    closeBtn.onclick = () => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    };

    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;

    alertDiv.appendChild(msgSpan);
    alertDiv.appendChild(closeBtn);

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 500);
    }, 3000);
}

// Initialize
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;

// Check if there's data to display
if (students.length > 0) {
    renderStudentData();
}