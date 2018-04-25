const rate = (code) => {
  return (move) => {
    if (code.length !== move.length) {
      console.warn('Code and move lengths are not the same');
      return;
    }
    const rating = {
      white: {},
      black: {},
    };
    move = move.filter((number, index) => {
      if (code[index] === number) {
        rating.black[index] = true;
        return false;
      }
      return true;
    });
    move.forEach((number) => {
      const foundIndex = code.indexOf(number);
      if (foundIndex >= 0 && !rating.black[foundIndex] && !rating.white[foundIndex]) {
        rating.white[foundIndex] = true;
      }
    });
    return {
      white: Object.keys(rating.white).length,
      black: Object.keys(rating.black).length,
    };
  }
};


let games = {};

const generateGame = (gameObject) => {
  const {size, dim} = gameObject;
  let game = [];
  for (let i = 0; i < size; i++) {
    game.push(Math.floor(Math.random() * dim));
  }
  return game;
};

const newGame = (req, res) => {
  const gameParams = {};
  console.log(req.session);
  const {size, dim, max} = req.body;
  if (size) {
    gameParams.size = size;
  }
  else {
    gameParams.size = 5;
  }
  if (dim) {
    gameParams.dim = dim;
  }
  else {
    gameParams.dim = 9;
  }
  if (max) {
    gameParams.max = max;
  }
  else {
    gameParams.max = 0;
  }

  const currentGame = generateGame(gameParams);
  const result = {
    game: currentGame,
    params: gameParams,
  };
  const gameId = Object.keys(games).length;
  res.session = gameId;
  games[gameId] = result;
  res.send(gameParams);
  console.log(result);
};

const markAnswer = (req, res) => {
  console.log(req.session);
  console.log(req.body);
};

module.exports = {
  newGame,
  markAnswer
};