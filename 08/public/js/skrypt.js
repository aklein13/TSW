const routes = {
  play: {method: 'POST', route: '/play'},
  mark: {method: 'POST', route: '/mark'},
};

let gameDiv;

const gameInput = '<input type="number"/>';

let currentGame = [];

const sendRequest = async (route, callback) => {
  const body = {};
  const init = {
    method: route.method,
    body: JSON.stringify(body),
  };
  const url = route.route;
  const request = new Request(url);
  fetch(request, init).then((response) => response.json())
    .catch(() => alert('Network request failed'))
    .then(callback);
};

const initGame = () => {
  sendRequest(routes.play, renderFields);
  gameDiv = document.getElementById('game');
};

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    initGame();
  }
};

const submitForm = (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log(currentGame);
};

const renderFields = ({responseJSON}) => {
  console.log(responseJSON);
  const {size} = responseJSON;
  const currentFormId = 'form1';
  $('#game').append(`<form id="${currentFormId}" onsubmit="submitForm()"/>`);
  for (let i = 0; i < size; i++) {
    $(`#${currentFormId}`).append(gameInput);
  }
  // sendRequest(routes.mark);
};
