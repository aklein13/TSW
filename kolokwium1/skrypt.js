//jshint browser: true, esversion: 6, devel: true
'use strict';

const playerList = [
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
  {no: 26, name: 'Wieża Bajek'}
];

let currentPlayerIndex;
let currentPlayerElement;
let inputs;
let playerDisplay;
let currentScore = [];
let displayResult;
let button;

const calculateResult = () => {
  const array = currentScore.filter(val => val);
  return array.length > 0 ? (array.reduce(getSum) / 3).toFixed(2) : '0.0';
};

const choosePlayer = (element, player, index) => {
  if (!currentPlayerElement) {
    button.disabled = false;
  }
  if (currentPlayerElement) {
    currentPlayerElement.classList.remove('active');
  }
  element.classList.add('active');
  currentPlayerIndex = index;
  currentPlayerElement = element;
  playerDisplay.innerText = player.name;
  currentScore = player.scores || [];
  inputs.forEach((input, inputIndex) => input.value = currentScore[inputIndex] || '');
  displayResult.innerText = calculateResult();
};

const getSum = (total, current) => total + current;

const writePlayer = (e, index) => {
  if (!currentPlayerElement) {
    alert('Pierw wybierz zawodnika');
    e.target.value = '';
    return;
  }
  const value = parseInt(e.target.value);
  const isValueNan = isNaN(value);
  if (isValueNan || value < 0 || value > 99) {
    if (isValueNan) {
      e.target.value = '';
      delete currentScore[index];
      displayResult.innerText = calculateResult();
    }
    else {
      e.target.value = currentScore[index] + '' || '';
    }
    return;
  }
  e.target.value = value + '';
  currentScore[index] = value;
  displayResult.innerText = calculateResult();
};

const save = () => playerList[currentPlayerIndex].scores = currentScore;

const initApplication = () => {
  const list = document.getElementById('lista');
  playerList.forEach((player, index) => {
    const li = document.createElement('li');
    li.innerText = player.name;
    li.id = 'p' + index;
    li.addEventListener('click', (e) => choosePlayer(e.target, player, index));
    list.append(li);
  });
  const foundInputs = document.querySelectorAll('input');
  playerDisplay = document.getElementById('zawodnik');
  let columnIterCount = 1;
  let rowIterCount = 0;
  foundInputs.forEach((input, index) => {
    input.tabIndex = columnIterCount + 3 * rowIterCount;
    rowIterCount++;
    if (rowIterCount === 5) {
      columnIterCount++;
      rowIterCount = 0;
    }
    input.type = 'number';
    input.oninput = (e) => writePlayer(e, index);
  });
  inputs = foundInputs;
  const container = document.getElementById('wyniki');
  displayResult = document.createElement('p');
  displayResult.id = 'result';
  displayResult.innerText = '0.0';
  container.append(displayResult);
  button = document.getElementById('guzik');
  button.disabled = true;
  button.addEventListener('click', save);
};

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    initApplication();
  }
};
