var MIN_PAGES = 1;
var MAX_PAGES = 5;

var favGists = [];   //favorite gists (stored in localStorage) - see window.onload
var resultGists = []; //stores results after calling fetchGists

//Called from html, calls AJAX function getGists and loads resultGists 
function initiateSearch() {  
  //loop calls for gists, parses them, and pushes them to the array results
  var pages = document.getElementsByName('number-of-pages')[0].value;
  if ((pages < MIN_PAGES) || (pages > MAX_PAGES)) {
    var str = "You must select from 1 to 5 pages";
    document.getElementById('error-message').innerText = str;
  }
  else {
    document.getElementById('error-message').innerText = "";
    for (var i = 0; i < pages; i++) {
      var page = i+1;
      getGists(page);
    }
  }
}


//Gist object
function Gist(id,description,html_url,fileLanguages) {
  this.id = id
  this.description = description;
  this.html_url = html_url;
  this.fileLanguages = fileLanguages;
  this.containsLanguage = function(l) {
    var result = false;
    fileLanguages.forEach(function(s){
      if (result === true || s === l){
        result = true;
      }
    });
    return result;
  };
}

/*
function lFilter() = {
  this->python = document.getElementById('lfilter-python').checked;
  json : document.getElementById('lfilter-json').checked;
  js : document.getElementById('lfilter-javascript').checked;
  sql : document.getElementById('lfilter-sql').checked;
  unchecked : function(){
    if (!python && !json && !js && !sql) {
      return true;
    }
    else {
      return false;
    }
  }
};
*/

/* Requests gists from github.  The following parameters are used:
  URL
*/
function getGists(page){
  //clear results off page
  while (resultGists.length > 0){
    var id = resultGists[0].id;
    var fromTbl = document.getElementById('search-gist-results');
    var rowToRemove = document.getElementById(id);
    fromTbl.removeChild(rowToRemove);
    removeResultGist(0);
  }
  
  //get filters from html page
  var lFilter = [];
  if (document.getElementsByName('lfilter-python')[0].checked === true){
    lFilter.push("Python");
  }
  if (document.getElementsByName('lfilter-json')[0].checked === true){
    lFilter.push("JSON");
  }
  if (document.getElementsByName('lfilter-javascript')[0].checked === true){
    lFilter.push("JavaScript");
  }
  if (document.getElementsByName('lfilter-sql')[0].checked === true){
    lFilter.push("SQL");
  }  
  
  //create request
  var req = new XMLHttpRequest();
  if(!req){
    throw 'Unable to create HttpRequest.';
  }
  var url = 'https://api.github.com/gists/public';
  //used in debugging
  //var url = 'http://web.engr.oregonstate.edu/~johnsjo3/CS290/assign3p2/localGists';
    req.onreadystatechange = function(){
      if(this.readyState === 4){
        //var gists stores parsed response text
        var parsedGistPage = JSON.parse(this.responseText);    
        
        parsedGistPage.forEach(function(s){
          var id = s.id;
          var html_url = s.html_url;
          var description = s.description;
          if (description.length === 0){
            description = "No Description"
          }
          
          var fileLanguages = [];
          
          //adapted from instructor's code (Piazza @180)
          //pulls all languages used in gist and puts them into an array
          for (var property in s.files) {
            if (s.files.hasOwnProperty(property)) {
              if (s.files[property].language){
                fileLanguages.push(s.files[property].language);
              }
            }
          }
          
          newGist = new Gist(id,description,html_url,fileLanguages);
          var passTest = false;
          if(lFilter.length === 0) {
            passTest = true;
          }
          else {
            lFilter.forEach(function(f){
              if (newGist.containsLanguage(f) === true) {
                passTest = true;
              }
            });
          }
          if (passTest === true) {
            addResultGist(newGist);
          }
        });
      }
    }
  req.open('GET', url  + '?page=' + (page));
  req.send();
}

//adds a passed gist to the resultGists array and prints to html page
function addResultGist(g) {
  //make sure gist is not already in favorites
  var inFavs = false;
  favGists.forEach(function(f){
      inFavs = (inFavs || (g.id === f.id));
  });
  
  //make sure gist is not already in results
  var inResults = false;
  resultGists.forEach(function(f){
    inResults = (inResults || (g.id === f.id));
  });

  if (inFavs === false && inResults === false){
    //add element to the array and print
    resultGists.push(g);
    printResultGist(g);
  }
}

//removes index from array and removes corresponding element from html page
function removeResultGist(index) {
  //removes element from array
  resultGists.splice(index, 1);    
}

function addFavGist(g) {
  //make sure gist is not already in favorites
  var inFavs = false;
  favGists.forEach(function(f){
      inFavs = (inFavs || (g.id === f.id));
  });
  
  //make sure gist is not already in results
  var inResults = false;
  resultGists.forEach(function(f){
    inResults = (inResults || (g.id === f.id));
  });

  if (inFavs === false && inResults === false){
    //update FavGist array
    favGists.push(g);
    //update localStorage
    localStorage.setItem('favGists-storage', JSON.stringify(favGists));
    //update HTML
    printFavGist(g);
  }
}

function removeFavGist(index) {
  //removes element from array
  favGists.splice(index, 1); 
  //update localStorage
  localStorage.setItem('favGists-storage', JSON.stringify(favGists));
}

function printResultGist(g){
  var tblBody = document.getElementById('search-gist-results');
  var row = document.createElement('tr');
  row.setAttribute("id", g.id)
  
  //button
  var cell1 = document.createElement('td');
  var button = document.createElement('input');
  button.setAttribute("type","button")
  button.setAttribute("value", "Move to Favorites");
  button.setAttribute("onclick","moveGistToFav('" + g.id + "')");
  cell1.appendChild(button);
  
  //description and html link
  var cell2 = document.createElement('td');
  cell2.innerHTML = "<a href=\'" + g.html_url + "\'>" + g.description + "</a>";
  
  //bulleted list of languages
  var cell3 = document.createElement('td');
  var ul = document.createElement('ul');
  g.fileLanguages.forEach(function(l){
    var bullet = document.createElement('li');
    bullet.innerText = l;
    ul.appendChild(bullet);
  });
  cell3.appendChild(ul);
  
  row.appendChild(cell1);
  row.appendChild(cell2);
  row.appendChild(cell3);
  
  tblBody.appendChild(row);
}

function printFavGist(g){
  var tblBody = document.getElementById('favorite-gists');
  var row = document.createElement('tr');
  row.setAttribute("id", g.id)
  
  //button
  var cell1 = document.createElement('td');
  var button = document.createElement('input');
  button.setAttribute("type","button")
  button.setAttribute("value", "Remove");
  button.setAttribute("onclick","moveGistToResult('" + g.id + "')");
  cell1.appendChild(button);
  
  //description and html link
  var cell2 = document.createElement('td');
  cell2.innerHTML = "<a href=\'" + g.html_url + "\'>" + g.description + "</a>";
  
  //bulleted list of languages
  var cell3 = document.createElement('td');
  var ul = document.createElement('ul');
  g.fileLanguages.forEach(function(l){
    var bullet = document.createElement('li');
    bullet.innerText = l;
    ul.appendChild(bullet);
  });
  cell3.appendChild(ul);
  
  row.appendChild(cell1);
  row.appendChild(cell2);
  row.appendChild(cell3);
  
  tblBody.appendChild(row);
}

function moveGistToFav(id) {
  //for debugging
  console.log(id);
  
  //remove element from page
  var fromTbl = document.getElementById('search-gist-results');
  var rowToMove = document.getElementById(id);
  fromTbl.removeChild(rowToMove);

  //find element in array
  var index;
  for (var i = 0; i < resultGists.length; i++){
    if (resultGists[i].id === id) {
      index = i;
      console.log(index);
    }
  }
  
  tmp = resultGists[index];
  removeResultGist(index);
  addFavGist(tmp);

}

function moveGistToResult(id) {
  //for debugging
  console.log(id);
  
  //remove element from page
  var fromTbl = document.getElementById('favorite-gists');
  var rowToMove = document.getElementById(id);
  fromTbl.removeChild(rowToMove);

  //find element in array
  var index;
  for (var i = 0; i < favGists.length; i++){
    if (favGists[i].id === id) {
      index = i;
    }
  }

  tmp = favGists[index];
  removeFavGist(index);  
  addResultGist(tmp);

}

//Loads user favorites on load
window.onload = function() {
  var favStr = localStorage.getItem('favGists-storage');
  if( favStr === null ) {
    localStorage.setItem('favGists-storage', JSON.stringify(favGists));
  }
  else {
    favGists = JSON.parse(localStorage.getItem('favGists-storage'));
  }
  
  favGists.forEach(function(g){
    printFavGist(g);
  });
  
}