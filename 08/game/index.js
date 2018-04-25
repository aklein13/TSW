//jshint node: true, esversion: 6
const newGame = (req, res) => {
  res.send("Do zrobienia!");
};

const markAnswer = (req, res) => {
  res.send("Też do zrobienia");
};

module.exports = {
  newGame,
  markAnswer
};