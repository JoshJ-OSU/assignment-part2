var results = [];     //array of gist objects
var favorites = [];   //favorite gists (stored in localStorage)
var myGists = [];

//Called from html: 
function initiateSearch() {  
  //loop calls for gists, parses them, and pushes them to the array results
  var pages = document.getElementsByName('number-of-pages')[0].value;
  for (var i = 0; i < pages; i++) {
    var page = i+1;
    getGists(page);
  }
  
  //output to html
  printGists(myGists);
}

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
  };
}

/* Requests gists from github.  The following parameters are used:
  URL
*/
function getGists(page){
  var parsedGistPage;
  var gists = [];
  var req = new XMLHttpRequest();
  if(!req){
    throw 'Unable to create HttpRequest.';
  }
  //var url = 'https://api.github.com/gists/public';
  var url = 'http://web.engr.oregonstate.edu/~johnsjo3/CS290/assign3p2/localGists';
    req.onreadystatechange = function(){
      if(this.readyState === 4){
        //var gists stores parsed response text
        var parsedGistPage = JSON.parse(this.responseText);    
        
        
        parsedGistPage.forEach(function(s){
          var id = s.id;
          var html_url = s.html_url;
          var description = s.description;
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
          
          gists.push(new Gist(id,description,html_url,fileLanguages));
        });
        
        addGist(gists);
      }
    }
  //    var rain = weather.list[0].weather.forEach(function(w){
  //      rain = rain && w.id >= 600;
  //    });
  //    createSportList(document.getElementById('sport-list'),
  //                      maxt, mint, rain);
  //  }
  //};
  req.open('GET', url )// + '?page=' + (page));
  req.send();
  
  return gists;
}

function addGist(g) {
  myGists = myGists.concat(g);
}


function printGists(arr){
  var tblBody = document.getElementById('search-gist-results');
  arr.forEach(function(s) {
    var row = document.createElement('tr');
    row.setAttribute("id", s.id)
    
    //button
    var cell1 = document.createElement('td');
    cell1.innerHTML = "<input type=\'button\' value=\'" + s.id + " onclick=\'fave(\\\"" + s.id + "\\\")></input>"
    
    //description and html link
    var cell2 = document.createElement('td');
    cell2.innerHTML = "<a href=\'" + s.html_url + "\'>" + s.description + "</a>";
    
    //bulleted list of languages
    var cell3 = document.createElement('td');
    var ul = document.createElement('ul');
    s.fileLanguages.forEach(function(l){
      var bullet = document.createElement('li');
      bullet.innerText = l;
      ul.appendChild(bullet);
    });
    cell3.appendChild(ul);
    
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    
    tblBody.appendChild(row);
    
  });
}

function fave(id) {
  console.log(id);
}