const API_URL = 'http://localhost:3000/';

const API_HEADERS = {'Content-Type': 'application/json'};

const API = {
  bid: {route: API_URL + 'offers/', method: 'PUT'},
};

const sendRequest = async (route, callback, data) => {
  console.log(route);
  const headers = new Headers(API_HEADERS);
  const {method} = route;
  const init = {method, headers};
  if (data && (method === 'POST' || method === 'PUT')) {
    init.body = JSON.stringify(data);
  }
  const url = route.route;
  const request = new Request(url);
  fetch(request, init).then((response) => response.json())
    .then(callback);
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    console.log('hello');
  }
};

const bid = () => {
  const price = parseFloat($('#bid').val());
  const offerId = $('#offer_id').text();
  const initialPrice = parseFloat($('#offer_price').text());
  if (!price || !initialPrice) {
    return toastr.warning('Place your bid');
  }
  if (price - initialPrice < 1) {
    return toastr.error('Your bid must be at least 1 zł higher then current price');
  }
  sendRequest({...API.bid, route: API.bid.route + offerId}, null, {price});
};


const buy = () => {
  const offerId = $('#offer_id').text();
  sendRequest({...API.bid, route: API.bid.route + offerId}, null, {});
};
