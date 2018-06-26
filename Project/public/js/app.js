const API_URL = 'http://localhost:3000/';

const API_HEADERS = {'Content-Type': 'application/json'};

const API = {
  bid: {route: API_URL + 'offers/', method: 'PUT'},
};

const p = '<p class="text-muted">Ended</p>';
const li = '<li class="list-group-item">dd</li>';

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

const handleClose = (uid) => {
  $(`#offer-${uid}`).remove();
  $('.function-btn').remove();
  $('.insert-after').append(p);
};

const handleUpdate = ({price, uid}) => $(`#offer-${uid}-price`).text(`${price} zł`);

const handleNewMessage = (message) => {
  console.log(message);
  new Notification(
    'New message',
    {body: 'From ' + message.fromName},
  );
  const userId = $('#user-id').text();
  $(`#chat-${message.chat_id}-id`).before(
    `<li class="list-group-item ${message.from !== userId ? 'list-group-item-secondary' : ''}">${message.fromName} ${message.time}: ${message.message}</li>`
  );
};

const notifyMe = () => {
  if (Notification.permission !== 'denied') {
    Notification.requestPermission(null);
  }
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    notifyMe();
    const userId = $('#user-id').text();
    const updatesSocket = io(API_URL + 'updates');
    updatesSocket.on('close', handleClose);
    updatesSocket.on('update', handleUpdate);
    if (userId) {
      const chatSocket = io(API_URL + 'chat');
      chatSocket.on('connect', () => chatSocket.emit('user_info', userId));
      chatSocket.on('message', handleNewMessage);
    }
  }
};

const bid = () => {
  const price = parseFloat($('#bid').val());
  const offerId = $('#offer_id').text();
  const initialPrice = parseFloat($('.offer_price').text());
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
