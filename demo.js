var settings = null;

 /* Begin sport section */
 
function Sport(sName, minTemp, maxTemp, rainOK) {
  this.sName = sName;
  this.minTemp = minTemp;
  this.maxTemp = maxTemp;
  this.rainOK = rainOK;
}

function addSport(settings, sport) {
  if(sport instanceof Sport) {
    settings.sports.push(sport);
    localStorage.setItem('userSettings', JSON.stringify(settings));
    return true;
  }
  console.error('Attempted to add non-sport.');
  return false;
}

function liSport(sport) {
  var dl = document.createElement('dl');
  var entry = dlEntry('Name', sport.sName);
  dl.appendChild(entry.dt);
  dl.appendChild(entry.dd);
  var entry = dlEntry('Minimum Temperature', sport.minTemp);
  dl.appendChild(entry.dt);
  dl.appendChild(entry.dd);
  var entry = dlEntry('Maximum Temperature', sport.maxTemp);
  dl.appendChild(entry.dt);
  dl.appendChild(entry.dd);
  var entry = dlEntry('Rain OK', sport.rainOK);
  dl.appendChild(entry.dt);
  dl.appendChild(entry.dd);
  return dl;
}

function dlEntry(term, definition) {
  var dt = document.createElement('dt');
  var dd = document.createElement('dd');
  dt.innerText = term;
  dd.innerText = definition;
  return {'dt':dt, 'dd':dd};
}

function saveSport() {
  var sName = document.getElementsByName('sport-name')[0].value;
  var minT = document.getElementsByName('sport-min-temp')[0].value;
  var maxT = document.getElementsByName('sport-max-temp')[0].value;
  var rainOK = document.getElementsByName('sport-rain-ok')[0].checked;
  var s = new Sport(sName, minT, maxT, rainOK);
  addSport(settings, s);
}

function createSportList(ul, maxt, mint, rain) {
  for (var i = ul.childNodes.length - 1; i >= 0; i--) {
    ul.removeChild(ul.childNodes[i]);
  }
  settings.sports.forEach(function(s) {
        var acceptable = (maxt < s.maxTemp && mint > s.minTemp && (s.rainOK || !rain) )
        var li = document.createElement('li');
        li.appendChild(liSport(s));
        if( acceptable ) {
          li.style.backgroundColor = 'green';
        }
        else {
          li.style.backgroundColor = 'red';
        }
        ul.appendChild(li);
  });
}

/* End sport section */

/* Begin weather section */

function getTomorrowsWeather(){
  var req = new XMLHttpRequest();
  if(!req){
    throw 'Unable to create HttpRequest.';
  }
  var citySelect = document.getElementsByName('city-select')[0];
  var url = 'http://api.openweathermap.org/data/2.5/forecast/daily';
  var params = {
    q: citySelect.options[citySelect.selectedIndex].value,
    mode: 'json',
    units: 'imperial',
    cnt: '7'
  };
  url += '?' + urlStringify(params);
  req.onreadystatechange = function(){
    if(this.readyState === 4){
      var weather = JSON.parse(this.responseText);
      var maxt = weather.list[0].temp.max;
      var mint = weather.list[0].temp.min;
      var rain = weather.list[0].weather.forEach(function(w){
        rain = rain && w.id >= 600;
      });
      createSportList(document.getElementById('sport-list'),
                        maxt, mint, rain);
    }
  };
  req.open('GET', url);
  req.send();
}

function urlStringify(obj){
  var str = []
  for(var prop in obj){
    var s = encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]);
    str.push(s);
  }
  return str.join('&');
}

/* End weather section */

window.onload = function() {
  var settingsStr = localStorage.getItem('userSettings');
  if( settingsStr === null ) {
    settings = {'sports':[]};
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }
  else {
    settings = JSON.parse(localStorage.getItem('userSettings'));
  }
  getTomorrowsWeather();
};