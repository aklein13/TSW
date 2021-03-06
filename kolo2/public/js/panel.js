//jshint browser: true, esversion: 6

const API_ROUTE = 'http://localhost:3000/';

const API_HEADERS = {'Content-Type': 'application/json'};

const routes = {
  list: {method: 'GET', route: 'list'},
  result: {method: 'POST', route: 'result/'},
};

let playerList;
let playerName;
let currentPlayerIndex;
let currentScore = [];
let inputs;
let resultsSocket;

const sendRequest = async (route, callback, data) => {
  const headers = new Headers(API_HEADERS);
  const {method} = route;
  const init = {method, headers};
  if (method === 'POST' && data) {
    init.body = JSON.stringify(data);
  }
  const url = API_ROUTE + route.route;
  const request = new Request(url);
  fetch(request, init).then((response) => response.json())
    .then(callback);
};

const writePlayer = (e, index) => {
  const value = parseInt(e.target.value);
  const isValueNan = isNaN(value);
  if (isValueNan || value < 0 || value > 99) {
    if (isValueNan) {
      e.target.value = '';
      delete currentScore[index];
    }
    else {
      e.target.value = currentScore[index] + '' || '';
    }
    return;
  }
  e.target.value = value + '';
  currentScore[index] = value;
};

const save = () => {
  const resultRoute = {...routes.result};
  resultRoute.route += (currentPlayerIndex + 1);
  sendRequest(resultRoute, null, {result: currentScore});
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    playerList = document.getElementById('list');
    playerName = document.getElementById('name');
    sendRequest(routes.list, renderPlayers);
    inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => input.oninput = (e) => writePlayer(e, index));
    document.getElementById('sendbtn').onclick = save;
    resultsSocket = io(API_ROUTE + 'results');
    resultsSocket.on('update_scores', () => {
      // No time for anything better...
      while (playerList.firstChild) {
        playerList.removeChild(playerList.firstChild);
      }
      sendRequest(routes.list, renderPlayers);
    });
  }
};

const selectPlayer = (player, index) => {
  const {name} = player;
  playerName.textContent = name;
  currentPlayerIndex = index;
  currentScore = player.result || [];
  inputs.forEach((input, index) => input.value = currentScore[index] || '');
};

const renderPlayer = (player, index) => {
  const newPlayer = document.createElement('ul');
  let totalScore = '';
  if (player.result) {
    totalScore = player.result.reduce((acc, val) => acc + val);
  }
  newPlayer.textContent = `${player.name} ${totalScore}`;
  newPlayer.onclick = () => selectPlayer(player, index);
  playerList.appendChild(newPlayer);
  index === 0 && newPlayer.click();
};

const renderPlayers = (list) => list.forEach(renderPlayer);
