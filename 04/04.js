const n = 30;

const fib = (arg) => {
  if (arg <= 0) {
    return 0;
  }
  if (arg === 1) {
    return 1;
  }
  return fib(arg - 1) + fib(arg - 2);
};

let cache = {1: 1};

const cachedFib = (n) => {
  if (n <= 0) {
    return 0;
  }
  if (cache[n]) {
    // console.log('Used cache', cache[n]);
    return cache[n];
  }
  cache[n] = cachedFib(n - 1) + cachedFib(n - 2);
  return cache[n];
};

const cachedResult = cachedFib(n);
console.log('Cached fib: ' + cachedResult);
const fibResult = fib(n);
console.log('Normal fib: ' + fibResult);
console.log(`Cached result is ${fibResult !== cachedResult ? 'not' : ''}the same`);
