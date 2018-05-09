const routes = {
  play: {method: 'POST', route: '/play'},
  mark: {method: 'POST', route: '/mark'},
};

let gameDiv;

const gameInput = '<input type="number"/>';

const sendRequest = async(route, callback) => {
  $.ajax({
    url: route.route,
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    complete: callback,
  });
};

const gameInit = ({responseJSON}) => {
  console.log(responseJSON);
};

const initGame = () => {
  sendRequest(routes.play, gameInit);
  gameDiv = document.getElementById('game');
};

const renderField = (params) => {
  $('#game').app(gameInput);
  sendRequest(routes.mark);
};
