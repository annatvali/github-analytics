import "./style.css";
import { Octokit } from "@octokit/core";

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
    const response = await octokit.request("GET /users/{username}", {
      username,
    });

    const user = response.data;
    displayUser(user);
  } catch (error) {
    throw new Error("Error fetching user data", error);
  }
}

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById('searchInput').value;
  fetchGitHubUsers(usernameInput);
});