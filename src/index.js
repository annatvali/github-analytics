import { data } from 'autoprefixer';
import './style.css';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

function displayUser(user) {
  const userContainer = document.getElementById('userContainer');
  userContainer.innerHTML = `
    <h2>${user.login}</h2>
    <img class="rounded-md" src=${user.avatar_url} width="200" height="200" alt="${user.login}'s github avatar" />
    <p>Name: ${user.name}</p>
    <p>Public Repositories: ${user.public_repos}</p>
    ${user.total_private_repos === undefined ? '' : `<p>Private Repositories: ${user.total_private_repos}</p>`}
    <p>Public Gists: ${user.public_gists}</p>
    <p>Followers: ${user.followers}</p>
    <p>Following: ${user.following}</p>
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

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById('searchInput').value;
  fetchGitHubUsers(usernameInput);
});

// select by country
let currentPage = 1;

document.getElementById('filterButton').addEventListener('click', (e) => {
  e.preventDefault();
  const country = document.getElementById('countrySelect').value;
  fetchGitHubUsersByCountry(country, currentPage);
});

async function fetchGitHubUsersByCountry(country, page) {
  const response = await fetch(`https://api.github.com/search/users?q=location:${country}&sort=followers&order=desc&page=${page}&per_page=10`);
  const data = await response.json();
  console.log(data);
  displayUsers(data.items);
  document.getElementById('prevButton').disabled = page === 1;
  document.getElementById('nextButton').disabled = data.items.length < 10;
}

function displayUsers(users) {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = "userElement grid items-center grid-cols-6 gap-4 bg-gray-100 p-4 rounded-md m-4"
    userElement.innerHTML = `
    <img class="rounded-full" src="${user.avatar_url}" width="80" height="80" alt="${user.name}'s github avatar">
    <p>Username: ${user.login}</p>
    <a href="${user.html_url}">URL: ${user.html_url}</a>
    <p>Contributions: ${user.score}</p>
    `;
    userList.appendChild(userElement);
  });
}

document.getElementById('prevButton').addEventListener('click', (e) => {
  e.preventDefault();
  currentPage--;
  const country = document.getElementById('countrySelect').value;
  fetchGitHubUsersByCountry(country, currentPage);
});

document.getElementById('nextButton').addEventListener('click', (e) => {
  e.preventDefault();
  currentPage++;
  const country = document.getElementById('countrySelect').value;
  fetchGitHubUsersByCountry(country, currentPage);
});