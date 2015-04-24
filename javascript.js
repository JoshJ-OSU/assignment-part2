/** 
 *  @fileoverview Asks github.com for recent gists, formats, and stores them.
 *  @author johnsjo3@onid.oregonstate.edu (Josh Johnson)
 */

/**
 *  MIN_PAGES and MAX_PAGES define limits upon user for pages to request
 */
var MIN_PAGES = 1;
var MAX_PAGES = 5;

/**
 *  storage of gist objects
 */
var favGists = [];      //favorite gists (stored in localStorage)
var resultGists = [];   //stores results after calling fetchGists


/**
 *  Constructor for object Gist
 *  @param {string} id  - unique id of gist
 *  @param {string} description - The description of the gist
 *  @param {string} html_url - links to gist's webpage
 *  @param {Array.<string>} fileLanguages - all of the languages used by gist
 *  @constructor
 */
function Gist(id, description, html_url, fileLanguages) {
  this.id = id;
  this.description = description;
  this.html_url = html_url;
  this.fileLanguages = fileLanguages;

  /**
   *  function returns if the passed in language is contained in fileLanguages
   *  @param {string} l - the language to check against
   *  @return {boolean} - true if l matches a language stored in fileLanguages
   *      false if l does not.  NOTE that the search is case sensitive.
   */
  this.containsLanguage = function (l) {
    var result = false;
    fileLanguages.forEach(function (s) {
      if (result === true || s === l) {
        result = true;
      }
    });
    return result;
  };
}


/**
 *  Formats the properties of passed gist object and appends them to the
 *      result table on the html page.
 *  @param {project.Gist}
 */
function printResultGist(g) {
  var tblBody = document.getElementById('search-gist-results');
  var row = document.createElement('tr');
  row.setAttribute("id", g.id);

  //button
  var cell1 = document.createElement('td');
  var button = document.createElement('input');
  button.setAttribute("type", "button");
  button.setAttribute("value", "Move to Favorites");
  button.setAttribute("onclick", "moveGistToFav('" + g.id + "')");
  cell1.appendChild(button);

  //description and html link
  var cell2 = document.createElement('td');
  var link = document.createElement('a');
  link.setAttribute("href", g.html_url);
  link.setAttribute("target", "_blank");
  link.textContent = g.description;
  cell2.appendChild(link);

  //bulleted list of languages
  var cell3 = document.createElement('td');
  var ul = document.createElement('ul');
  g.fileLanguages.forEach(function (l) {
    var bullet = document.createElement('li');
    bullet.textContent = l;
    ul.appendChild(bullet);
  });
  cell3.appendChild(ul);

  row.appendChild(cell1);
  row.appendChild(cell2);
  row.appendChild(cell3);

  tblBody.appendChild(row);
}


/**
 *  Formats the properties of passed gist object and appends them to the
 *      favorites table on the html page.
 *  @param {project.Gist}
 */
function printFavGist(g) {
  var tblBody = document.getElementById('favorite-gists');
  var row = document.createElement('tr');
  row.setAttribute("id", g.id);

  //button
  var cell1 = document.createElement('td');
  var button = document.createElement('input');
  button.setAttribute("type", "button");
  button.setAttribute("value", "Remove");
  button.setAttribute("onclick", "moveGistToResult('" + g.id + "')");
  cell1.appendChild(button);

  //description and html link
  var cell2 = document.createElement('td');
  var link = document.createElement('a');
  link.setAttribute("href", g.html_url);
  link.setAttribute("target", "_blank");
  link.textContent = g.description;
  cell2.appendChild(link);

  //bulleted list of languages
  var cell3 = document.createElement('td');
  var ul = document.createElement('ul');
  g.fileLanguages.forEach(function (l) {
    var bullet = document.createElement('li');
    bullet.textContent = l;
    ul.appendChild(bullet);
  });
  cell3.appendChild(ul);

  row.appendChild(cell1);
  row.appendChild(cell2);
  row.appendChild(cell3);

  tblBody.appendChild(row);
}


/**
 *  Adds a passed gist to the resultGists array and prints to html page
 *    A Gist object cannot already be in either favGists or resultGists.
 *    If it is, it will be rejected.  This is done by comparing Gist.id
 *  @param {project.Gist} - The Gist object to add and print to results
 */
function addResultGist(g) {
  //make sure gist is not already in favorites
  var inFavs = false;
  favGists.forEach(function (f) {
    inFavs = (inFavs || (g.id === f.id));
  });

  //make sure gist is not already in results
  var inResults = false;
  resultGists.forEach(function (f) {
    inResults = (inResults || (g.id === f.id));
  });

  if (inFavs === false && inResults === false) {
    //add element to the array and print
    resultGists.push(g);
    printResultGist(g);
  }
}


/**
 * Removes resultGists[index] from resultGists.  When removed elements to the 
 * right of index shift one space to left to fill gap in array. 
 * @param {integer} index - Index of favGist to remove
 */
function removeResultGist(index) {
  //removes element from array
  resultGists.splice(index, 1);
}


/**
 *  Adds a passed gist to the favGists array and prints to html page.
 *    LocalStorage is updated.
 *    A Gist object cannot already be in either favGists or resultGists.
 *    If it is, it will be rejected.  This is done by comparing Gist.id
 *  @param {project.Gist} - The Gist object to add and print to results
 */
function addFavGist(g) {
  //make sure gist is not already in favorites
  var inFavs = false;
  favGists.forEach(function (f) {
    inFavs = (inFavs || (g.id === f.id));
  });

  //make sure gist is not already in results
  var inResults = false;
  resultGists.forEach(function (f) {
    inResults = (inResults || (g.id === f.id));
  });

  if (inFavs === false && inResults === false) {
    //update FavGist array
    favGists.push(g);
    //update localStorage
    localStorage.setItem('favGists-storage', JSON.stringify(favGists));
    //update HTML
    printFavGist(g);
  }
}


/**
 * Removes favGists[index] from favGists and updates localStorage.  When removed
 *    elements to the right of index shift one space to left to fill gap in
 *    array. 
 * @param {integer} index - Index of favGist to remove
 */
function removeFavGist(index) {
  //removes element from array.
  favGists.splice(index, 1);
  //update localStorage
  localStorage.setItem('favGists-storage', JSON.stringify(favGists));
}


/**
 * Moves gist from results to favorites section.  Updates arrays accordingly.
 *    @param {string} id - corresponds to Gist.id found in resultGists.
 *        This must match.  Operations performed on parent gist object.
 */
function moveGistToFav(id) {
  //remove element from page
  var fromTbl = document.getElementById('search-gist-results');
  var rowToMove = document.getElementById(id);
  fromTbl.removeChild(rowToMove);

  //find element in array
  var index;
  var i;
  for (i = 0; i < resultGists.length; i++) {
    if (resultGists[i].id === id) {
      index = i;
    }
  }

  var tmp = resultGists[index];
  removeResultGist(index);
  addFavGist(tmp);

}


/**
 * Moves gist from favorites to results section.  Updates arrays accordingly.
 *    @param {string} id - corresponds to Gist.id found in favGists.
 *        This must match.  Operations performed on parent gist object.
 */
function moveGistToResult(id) {
  //remove element from page
  var fromTbl = document.getElementById('favorite-gists');
  var rowToMove = document.getElementById(id);
  fromTbl.removeChild(rowToMove);

  //find element in array
  var index;
  var i;
  for (i = 0; i < favGists.length; i++) {
    if (favGists[i].id === id) {
      index = i;
    }
  }

  var tmp = favGists[index];
  removeFavGist(index);
  addResultGist(tmp);

}


/**
 * Requests gists via XMLHttpRequest.  Parses retrieved JSON. Applies filters
 *    based on settings provided by user on html page.  Then adds the resulting
 *    gists to resultGists.  resultGists is cleared in this operation as is
 *    the results section on the webpage. 
 * @param {number} page - the page number to retrieve from github.
 */
function getGists(page) {
  //clear results off page
  var gid;
  var fromTbl;
  var rowToRemove;
  while (resultGists.length > 0) {
    gid = resultGists[0].id;
    fromTbl = document.getElementById('search-gist-results');
    rowToRemove = document.getElementById(gid);
    fromTbl.removeChild(rowToRemove);
    removeResultGist(0);
  }

  //get filters from html page
  var lFilter = [];
  if (document.getElementsByName('lfilter-python')[0].checked === true) {
    lFilter.push("Python");
  }
  if (document.getElementsByName('lfilter-json')[0].checked === true) {
    lFilter.push("JSON");
  }
  if (document.getElementsByName('lfilter-javascript')[0].checked === true) {
    lFilter.push("JavaScript");
  }
  if (document.getElementsByName('lfilter-sql')[0].checked === true) {
    lFilter.push("SQL");
  }

  //create request
  var req = new XMLHttpRequest();
  if (!req) {
    throw 'Unable to create HttpRequest.';
  }
  var url = 'https://api.github.com/gists/public';
  //used in debugging
  //var url = 
  //  'http://web.engr.oregonstate.edu/~johnsjo3/CS290/assign3p2/localGists';

  req.onreadystatechange = function () {
    if (this.readyState === 4) {
      //var gists stores parsed response text
      var parsedGistPage = JSON.parse(this.responseText);

      /*Each parsed element is put into a gist object and passed through
      * a filter before being added to resultGists and printed to screen
      */
      parsedGistPage.forEach(function (s) {
        var id = s.id;
        var html_url = s.html_url;
        var description = s.description;
        if (description === null || description.length === 0) {
          description = "No Description";
        }

        //adapted from instructor's code (Piazza @180)
        //pulls all languages used in gist and puts them into an array
        var fileLanguages = [];
        var property;
        for (property in s.files) {
          if (s.files.hasOwnProperty(property)) {
            if (s.files[property].language) {
              fileLanguages.push(s.files[property].language);
            }
          }
        }

        //create the gist object
        var newGist = new Gist(id, description, html_url, fileLanguages);

        //test to see if gist passes the filter tests
        var passTest = false;
        if (lFilter.length === 0) {
          passTest = true;
        } else {
          lFilter.forEach(function (f) {
            if (newGist.containsLanguage(f) === true) {
              passTest = true;
            }
          });
        }

        //if gist passes, add to resultGist and print to screen
        if (passTest === true) {
          addResultGist(newGist);
        }
      });
    }
  };
  req.open('GET', url  + '?page=' + page);
  req.send();
}


/**
 * Error check user's page input, then submits requests for gists by calling
 *    getGists(page)
 */
function initiateSearch() {
  //loop calls for gists, parses them, and pushes them to the array results
  var pages = document.getElementsByName('number-of-pages')[0].value;
  if ((pages < MIN_PAGES) || (pages > MAX_PAGES)) {
    var str = "";
    str = "You must select from " + MIN_PAGES + " to " + MAX_PAGES + " pages.";
    document.getElementById('error-message').textContent = str;
  } else {
    document.getElementById('error-message').textContent = "";

    var i;
    var page;
    for (i = 0; i < pages; i++) {
      page = i + 1;
      getGists(page);
    }
  }
}


/**
 *  Loads the user's favorite gists from LocalStorage if present.
 */
window.onload = function () {
  var favStr = localStorage.getItem('favGists-storage');
  if (favStr === null) {
    localStorage.setItem('favGists-storage', JSON.stringify(favGists));
  } else {
    favGists = JSON.parse(localStorage.getItem('favGists-storage'));
  }

  favGists.forEach(function (g) {
    printFavGist(g);
  });
};