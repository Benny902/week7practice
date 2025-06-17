const API_BASE_URL = 'http://localhost:3000'; // this is local
//const API_BASE_URL = 'https://week5-ci-cd.onrender.com';

const form = document.getElementById('blog-form');
const input = document.getElementById('blog-input');
const blogsList = document.getElementById('blogs-list');

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = (input.scrollHeight) + 'px';
});

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('he-IL', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

async function loadBlogs() {
  const response = await fetch(`${API_BASE_URL}/blogs`);
  let blogs = await response.json();

  blogs = blogs.reverse();

  blogsList.innerHTML = '';
  blogs.forEach(blog => {
    const div = document.createElement('div');
    div.className = 'blog';

    const textDiv = document.createElement('div');
    textDiv.textContent = blog.text;
    textDiv.className = 'blog-text';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => {
      startEdit(blog, div, textDiv);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
      deleteBlog(blog.id);
    };

    const timestampDiv = document.createElement('div');
    timestampDiv.textContent = formatTimestamp(blog.timestamp);
    timestampDiv.className = 'timestamp';

    div.appendChild(textDiv);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    div.appendChild(timestampDiv);
    blogsList.appendChild(div);
  });
}

function startEdit(blog, blogDiv, textDiv) {
  const textarea = document.createElement('textarea');
  textarea.value = blog.text;
  textarea.rows = 3;
  Object.assign(textarea.style, {
    width: '100%',
    fontSize: '1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'none',
    overflow: 'hidden',
    fontFamily: 'monospace'
  });
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  });

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'save-btn';
  saveBtn.onclick = async () => {
    await updateBlog(blog.id, textarea.value.trim());
    loadBlogs();
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'cancel-btn';
  cancelBtn.onclick = () => {
    blogDiv.replaceChild(textDiv, textarea);
    blogDiv.removeChild(saveBtn);
    blogDiv.removeChild(cancelBtn);
    blogDiv.appendChild(editBtn);
    blogDiv.appendChild(deleteBtn);
  };

  const editBtn = blogDiv.querySelector('.edit-btn');
  const deleteBtn = blogDiv.querySelector('.delete-btn');

  blogDiv.replaceChild(textarea, textDiv);
  blogDiv.removeChild(editBtn);
  blogDiv.removeChild(deleteBtn);
  blogDiv.appendChild(saveBtn);
  blogDiv.appendChild(cancelBtn);

  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

async function deleteBlog(id) {
  await fetch(`${API_BASE_URL}/blogs/${id}`, { method: 'DELETE' });
  loadBlogs();
}

async function updateBlog(id, text) {
  if (!text) return;
  await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch(`${API_BASE_URL}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  input.value = '';
  input.style.height = 'auto';
  loadBlogs();
});

loadBlogs();
