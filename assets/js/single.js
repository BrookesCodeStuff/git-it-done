var issueContainerEl = document.querySelector('#issues-container');
var limitWarningEl = document.querySelector('#limit-warning');
var repoNameEl = document.querySelector('#repo-name');

var getRepoName = function () {
  // Grab repo name from url query string
  var queryString = document.location.search;
  var repoName = queryString.split('=')[1];

  if (repoName) {
    // Display the repo name on the page
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
  } else {
    // If no repo was given, redirect to the homepage
    document.location.replace('./index.html');
  }
};

var getRepoIssues = function (repo) {
  var apiUrl = 'https://api.github.com/repos/' + repo + '/issues?direction=asc';
  // Make a request to the apiurl
  fetch(apiUrl).then(function (response) {
    // Request was successful
    if (response.ok) {
      response.json().then(function (data) {
        displayIssues(data);

        // Check if api has paginated issues
        if (response.headers.get('Link')) {
          displayWarning(repo);
        }
      });
    } else {
      // Request wasn't successful, go back to home
      document.location.replace('./index.html');
    }
  });
};

var displayIssues = function (issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = 'This repo has no open issues!';
    return;
  }
  for (var i = 0; i < issues.length; i++) {
    // Create a link element to take users to the issue on github
    var issueEl = document.createElement('a');
    issueEl.classList = 'list-item flex-row jsutify-space-between align-center';
    issueEl.setAttribute('href', issues[i].html_url);
    issueEl.setAttribute('target', '_blank');

    // Create span to hold issue title
    var titleEl = document.createElement('span');
    titleEl.textContent = issues[i].title;

    // Append to container
    issueEl.appendChild(titleEl);

    // Create a type element
    var typeEl = document.createElement('span');

    // Check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = '(Pull Request)';
    } else {
      typeEl.textContent = '(Issue)';
    }

    // Append to container
    issueEl.appendChild(typeEl);
    issueContainerEl.appendChild(issueEl);
  }
};

var displayWarning = function (repo) {
  // Add text to warning container
  limitWarningEl.textContent = 'To see more than 30 issues, visit ';

  var linkEl = document.createElement('a');
  linkEl.textContent = 'github.com';
  linkEl.setAttribute('href', 'https://github.com/' + repo + '/issues');
  linkEl.setAttribute('target', '_blank');

  // Append to warning container
  limitWarningEl.appendChild(linkEl);
};

getRepoName();
