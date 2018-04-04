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

const code = [0, 7, 7, 3];
let move = [3, 2, 0, 0];
console.log('Code', code);

console.log('Move', move);
let result = rate(code)(move);
console.log('Result', result);

move = [7, 5, 7, 5];
console.log('Move', move);
result = rate(code)(move);
console.log('Result', result);

move = [7, 7, 7, 7];
console.log('Move', move);
result = rate(code)(move);
console.log('Result', result);

move = [7, 5, 6, 9];
console.log('Move', move);
result = rate(code)(move);
console.log('Result', result);
