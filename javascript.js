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
  
}

function Gist(description,http_url,fileLanguages) {
  this.description = description;
  this.http_url = http_url;
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
  var url = 'https://api.github.com/gists/public';
    req.onreadystatechange = function(){
      if(this.readyState === 4){
        //var gists stores parsed response text
        var parsedGistPage = JSON.parse(this.responseText);    
        
        
        parsedGistPage.forEach(function(s){
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
          
          gists.push(new Gist(description,html_url,fileLanguages));
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
  req.open('GET', url + '?page=' + (page));
  req.send();
  
  return gists;
}

function addGist(g) {
  myGists = myGists.concat(g);
}
/*
function printGists(arr){
  arr.forEach(function(s){
    
  });
}*/