var options = {
  showPython:
}

function initiateSearch {  
  jja
}

/* Requests gists from github.  The following parameters are used:
  URL
*/
function getGists(){
  var parsedGistPages = [];
  var req = new XMLHttpRequest();
  if(!req){
    throw 'Unable to create HttpRequest.';
  }
  var url = 'https://api.github.com/gists/public';
  var params = {
  //  q: citySelect.options[citySelect.selectedIndex].value,
  //  mode: 'json',
  //  units: 'imperial',
  //  cnt: '7'
    pages: '' 
  };
  //url += '?' + urlStringify(params);
    req.onreadystatechange = function(){
      if(this.readyState === 4){
        //var gists stores parsed response text
        var parsedGistPages.push(JSON.parse(this.responseText));    
  //    
  
        var desc = weather.list[0].temp.max;
        var html_url = parsedGistPages.html_url;
  //    var rain = weather.list[0].weather.forEach(function(w){
  //      rain = rain && w.id >= 600;
  //    });
  //    createSportList(document.getElementById('sport-list'),
  //                      maxt, mint, rain);
  //  }
  //};
  for (var i = 0; i < pages; i++) {
    req.open('GET', url + '?page=' + (i+1));
    req.send();
  }
}