//jshint browser: true, esversion: 6

const API_ROUTE = 'http://localhost:3000/';

const routes = {
  list: {method: 'GET', route: 'list'},
  result: {method: 'POST', route: 'result/'},
};

let playerList;
let playerName;
let currentPlayerIndex;

const sendRequest = async (route, callback, data) => {
  const {method} = route;
  const init = {method};
  if (method === 'POST' && data) {
    init.body = JSON.stringify(data);
  }
  const url = API_ROUTE + route.route;
  console.log(url);
  const request = new Request(url);
  fetch(request, init).then((response) => response.json())
    .catch((e) => alert(e))
    .then(callback);
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    playerList = document.getElementById('list');
    playerName = document.getElementById('name');
    sendRequest(routes.list, renderPlayers);
  }
};

const selectPlayer = (player, index) => {
  const {name} = player;
  playerName.textContent = name;
  currentPlayerIndex = index;
};

const renderPlayer = (player, index) => {
  console.log(playerList);
  const newPlayer = document.createElement('ul');
  newPlayer.textContent = player.name;
  newPlayer.onclick = (e) => selectPlayer(player, index);
  playerList.appendChild(newPlayer);
  index === 0 && newPlayer.click();
};

const renderPlayers = (list) => list.forEach(renderPlayer);


