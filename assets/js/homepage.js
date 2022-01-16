var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

var formSubmitHandler = function (event) {
  event.preventDefault();
  var username = nameInputEl.value.trim();
  if (username) {
    getUserRepos(username);
    nameInputEl.value = '';
  } else {
    alert('Please enter a Github username');
  }
};

var getUserRepos = function (user) {
  // Format the github api url
  var apiUrl = 'https://api.github.com/users/' + user + '/repos';

  // Make a request to the url
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayRepos(data, user);
    });
  });
};

var displayRepos = function (repos, searchTerm) {
  // Clear old content
  repoContainerEl.textContent = '';
  repoSearchTerm.textContent = searchTerm;

  // Loop over repos
  for (var i = 0; i < repos.length; i++) {
    // Format repo name
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    // Create a contain for each repo
    var repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';

    // Create a span element to hold repository name
    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    // Append to container
    repoEl.appendChild(titleEl);

    // Create a status element
    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    // Check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        '<i class="fas fa-times status-icon icon-danger"></i>' +
        repos[i].open_issues_count +
        ' issue(s)';
    } else {
      statusEl.innerHTML =
        '<i class="fas fa-check-square status-icon icon-success"></i>';
    }

    // Append to container
    repoEl.appendChild(statusEl);

    // Append container to the DOM
    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
