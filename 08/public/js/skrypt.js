const routes = {
  play: {method: 'POST', route: '/play'},
  mark: {method: 'POST', route: '/mark'},
};

let response;

const sendRequest = (route) => {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const gameParams = JSON.parse(xhr.response);
    console.log(gameParams);
    return renderField(gameParams);
  };
  xhr.open(route.method, route.route, true);
  return xhr;
};

const initGame = () => {
  console.log('init');
  sendRequest(routes.play);
};

const renderField = (params) => {
  console.log(params);
  sendRequest(routes.mark);
};
