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
  const amount = parseFloat($('#bid').val());
  const offerId = $('#offer_id').text();
  console.log(offerId);
  const initialPrice = parseFloat($('#offer_price').text());
  if (!amount || !amount) {
    return toastr.warning('Place your bid');
  }
  if (amount - initialPrice < 1) {
    return toastr.error('Your bid must be at least 1 zł higher then current price');
  }
  console.log(API.bid);
  sendRequest({...API.bid, route: API.bid.route + offerId}, null, {amount});
};

