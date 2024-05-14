// script.js
import { fetchUsers } from './userService.js';

let users = [];
let filteredUsers = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        users = await fetchUsers();
        filteredUsers = users;
        renderUserList();
        addEventListeners();
    } catch (error) {
        console.error('Error fetching users:', error);
        document.getElementById('userList').innerHTML = '<li>Error loading users</li>';
    }
});

function addEventListeners() {
    document.getElementById('search').addEventListener('input', (e) => filterUsers(e.target.value));
    document.getElementById('userList').addEventListener('click', (e) => showUserDetails(e.target));
}

function filterUsers(query) {
    filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    renderUserList();
}

function renderUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    filteredUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.name;
        li.dataset.userId = user.id;
        userList.appendChild(li);
    });
}

function showUserDetails(target) {
    const userId = target.dataset.userId;
    if (!userId) return;

    const user = users.find(user => user.id == userId);
    if (user) {
        const userDetails = document.getElementById('userDetails');
        userDetails.innerHTML = `
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
            <p>Website: <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            <p>Company: ${user.company.name}</p>
        `;
    }
}