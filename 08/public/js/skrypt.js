const routes = {
  play: {method: 'POST', route: '/play'},
  mark: {method: 'POST', route: '/mark'},
};

let gameDiv;

const gameInput = '<input type="number"/>';

let currentGame = [];

const sendRequest = async (route, callback) => {
  $.ajax({
    url: route.route,
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    complete: callback,
  });
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
