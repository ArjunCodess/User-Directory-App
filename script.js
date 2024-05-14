// script.js
import { fetchUsers } from './userService.js';

const USERS_PER_PAGE = 5;
let users = [];
let filteredUsers = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        showSpinner();
        users = await fetchUsers();
        filteredUsers = users;
        populateCompanyFilter();
        renderUserList();
        renderPagination();
        addEventListeners();
    } catch (error) {
        showError('Error fetching users');
    } finally {
        hideSpinner();
    }
});

function addEventListeners() {
    document.getElementById('search').addEventListener('input', (e) => filterUsers(e.target.value));
    document.getElementById('clearSearch').addEventListener('click', clearSearch);
    document.getElementById('sortUsers').addEventListener('change', (e) => sortUsers(e.target.value));
    document.getElementById('filterCompany').addEventListener('change', (e) => filterByCompany(e.target.value));
    document.getElementById('userList').addEventListener('click', (e) => showUserDetails(e.target));
    document.getElementById('pagination').addEventListener('click', handlePaginationClick);
    window.addEventListener('scroll', handleScroll);
}

function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

function showError(message) {
    const userList = document.getElementById('userList');
    userList.innerHTML = `<li>${message}</li>`;
}

function filterUsers(query) {
    filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    currentPage = 1;
    renderUserList();
    renderPagination();
}

function clearSearch() {
    document.getElementById('search').value = '';
    filterUsers('');
}

function sortUsers(criteria) {
    filteredUsers.sort((a, b) => a[criteria].localeCompare(b[criteria]));
    renderUserList();
}

function populateCompanyFilter() {
    const companySet = new Set(users.map(user => user.company.name));
    const filterCompany = document.getElementById('filterCompany');
    companySet.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        filterCompany.appendChild(option);
    });
}

function filterByCompany(company) {
    if (company === 'all') {
        filteredUsers = users;
    } else {
        filteredUsers = users.filter(user => user.company.name === company);
    }
    currentPage = 1;
    renderUserList();
    renderPagination();
}

function renderUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    const start = (currentPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    const usersToShow = filteredUsers.slice(start, end);

    if (usersToShow.length === 0) {
        userList.innerHTML = '<li>No users found</li>';
        return;
    }

    usersToShow.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.name;
        li.dataset.userId = user.id;
        userList.appendChild(li);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = (i === currentPage);
        button.dataset.page = i;
        pagination.appendChild(button);
    }
}

function handlePaginationClick(event) {
    if (event.target.tagName !== 'BUTTON') return;

    currentPage = Number(event.target.dataset.page);
    renderUserList();
    renderPagination();
}

function showUserDetails(target) {
    const userId = target.dataset.userId;
    if (!userId) return;

    const user = users.find(user => user.id == userId);
    if (user) {
        const userDetails = document.getElementById('userDetails');
        userDetails.innerHTML = `
            <h2>${user.name}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            <p><strong>Company:</strong> ${user.company.name}</p>
            <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}, ${user.address.zipcode}</p>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Suite:</strong> ${user.address.suite}</p>
            <p><strong>Catchphrase:</strong> ${user.company.catchPhrase}</p>
            <p><strong>BS:</strong> ${user.company.bs}</p>
        `;
    }
}

function handleScroll() {
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
}