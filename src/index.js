import './style.css';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
const searchButton = document.getElementById('searchButton');
const filterBtn = document.getElementById('filterButton');
const prevBtn = document.getElementById('prevButton');
const nextBtn = document.getElementById('nextButton');
const itemsPerPage = 10;
let currentPage = '';
let pages = [];

function displayUser(user) {
  const userContainer = document.getElementById('userContainer');
  userContainer.className = "flex gap-4 p-6 lg:max-w-xl mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 my-8 hover:shadow-xl transition ease-in-out";
    userContainer.innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="font-medium text-black">${user.login}</div>
      <img class="rounded-md" src=${user.avatar_url} width="160" height="160" alt="${user.login}'s github avatar" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-2xl text-indigo-700 font-bold mb-4">${user.name}</p>
      <p class="text-gray-500"><span class="font-bold">Public Repositories:</span> ${user.public_repos}</p>
      <p class="text-gray-500"><span class="font-bold">Private Repositories:</span> ${user.total_private_repos || 'Not available'}</p>
      <p class="text-gray-500"><span class="font-bold">Public Gists:</span> ${user.public_gists}</p>
      <p class="text-gray-500"><spna class="font-bold">Followers:</spna> ${user.followers}</p>
      <p class="text-gray-500"><span class="font-bold">Following:</span> ${user.following}</p>
      <a href="${user.url}" class="text-gray-500"><span class="font-bold">Github url:</span> see more →</a>
    </div>
  `;
}

async function fetchGitHubUsers(username) {
  try {
    const response = await octokit.request('GET /users/{username}', {
      username,
    });

    const user = response.data;
    displayUser(user);
  } catch (error) {
    throw new Error('Error fetching user data', error);
  }
}

searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById('searchInput').value;
  fetchGitHubUsers(usernameInput);
});

filterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  currentPage = 1;
  const country = document.getElementById('countrySelect').value;
  fetchGitHubUsersByCountry(country, currentPage);
});

async function fetchGitHubUsersByCountry(country, page) {
  const response = await fetch(`https://api.github.com/search/users?q=location:${country}&sort=followers&order=desc&page=${page}&per_page=${itemsPerPage}`);
  const data = await response.json();
  displayUsers(data.items);
  document.getElementById('prevButton').disabled = page === 1;
  document.getElementById('nextButton').disabled = data.items.length < itemsPerPage;
}

function displayUsers(users) {
  const userList = document.getElementById('userList');
  userList.className = "grid sm:grid-cols-1 sm:grid-rows-4 lg:grid-cols-2 gap-4 my-12";
  userList.innerHTML = '';
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = "userElement grid items-center grid-cols-4  gap-2 bg-gray-100 p-4 rounded-md my-4 hover:scale-105 transition ease-in-out"
    userElement.innerHTML =
    `
    <div class="flex items-center">
      <p class="font-semibold mr-4">${users.indexOf(user) + 1}</p>
      <img class="rounded-full" src="${user.avatar_url}" width="80" height="80" alt="${user.name}'s github avatar">
    </div>
    <div>
      <h3 class="text-lg font-semibold text-indigo-900 mb-2">User ID</h3>
      <p>${user.id}</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-indigo-900 mb-2">Username</h3>
      <p>${user.login}</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-indigo-900 mb-2">Github URL</h3>
      <a href="${user.html_url}" class="text-blue-600 visited:text-purple-600">link</a>
    </div>
    `;
    userList.appendChild(userElement);
    document.getElementById('currentPage').textContent = currentPage;
    pages[currentPage] = users;
  });
}

prevBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentPage > 1) {
    currentPage--;
    const country = document.getElementById('countrySelect').value;
    fetchGitHubUsersByCountry(country, pages[currentPage]);
  }
});

nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  currentPage++;
if (pages[currentPage]) {
    displayUsers(pages[currentPage]);
  } else {
    const country = document.getElementById('countrySelect').value;
    fetchGitHubUsersByCountry(country, currentPage);
  }
});
