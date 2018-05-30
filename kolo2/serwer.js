/*jshint node: true, esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
const httpServer = require('http').createServer(app);

const list = [
  {no: 1, name: 'Wiga'},
  {no: 2, name: 'Paterna'},
  {no: 3, name: 'Etira'},
  {no: 4, name: 'Emandorissa'},
  {no: 5, name: 'Patria'},
  {no: 6, name: 'Galacja'},
  {no: 7, name: 'Paeksa'},
  {no: 8, name: 'Pilastra'},
  {no: 9, name: 'Elfira'},
  {no: 10, name: 'Fanabella'},
  {no: 11, name: 'Pustynna Noc'},
  {no: 12, name: 'Gratena'},
  {no: 13, name: 'Matahna'},
  {no: 14, name: 'Panetta'},
  {no: 15, name: 'Baklava'},
  {no: 16, name: 'Piera'},
  {no: 17, name: 'Wersa'},
  {no: 18, name: 'Atanda'},
  {no: 19, name: 'Escalada'},
  {no: 20, name: 'Faworyta'},
  {no: 21, name: 'Angelina'},
  {no: 22, name: 'Kalahari'},
  {no: 23, name: 'Godaiva'},
  {no: 24, name: 'Alamina'},
  {no: 25, name: 'Piacolla'},
  {no: 26, name: 'Wieża Bajek'},
];

const sortedList = (list) => {
  return list.sort((a, b) => {
    if (!a.result && !b.result) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
    }
    if (!a.result) {
      return 1;
    }
    if (!b.result) {
      return -1;
    }
    const aSum = a.result.reduce((acc, val) => acc + val);
    const bSum = b.result.reduce((acc, val) => acc + val);
    const diff = bSum - aSum;
    if (diff === 0) {
      const noteDiff = b.result[0] - a.result[0];
      if (noteDiff !== 0) {
        return noteDiff;
      }
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
    }
    return diff;
  });
};

app.get('/list', (req, res) => {
  const resultList = sortedList(list);
  console.log(resultList);
  res.send(list, 200)
});

app.post('/result/:no', (req, res) => {
  const {result} = req.body;
  if (!result || result.length !== 5) {
    return res.send('Invalid data', 400);
  }
  const {no} = req.params;
  const user = list[no - 1];
  if (!user) {
    return res.send('User not found', 404);
  }
  list[no - 1] = {...user, result};
  res.send(list[no - 1]);
  console.log(list);
});

app.get('/results', (req, res) => {
  // oferuje wyniki na żywo używając Socket.io
});

httpServer.listen(3000, () => console.log('Serwer działa na porcie 3000'));
