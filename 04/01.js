'use strict';

// const defFun = (fun, types) => {
//   return {...fun, typeConstr: types};
// };

const defFun = (fun, types) => {
  fun.typeConstr = types;
  return fun;
};

const appFun = function fuu(f, ...args) {
  if (!f.typeConstr) {
    throw({typerr: "No typeConstr"});
  }
  const {typeConstr} = f;
  args.forEach((arg, index) => {
    if (typeof arg !== typeConstr[index]) {
      throw({typerr: `${args[index]} at ${index + 1} is not ${typeConstr[index]}`});
    }
  });

  return f(...args);
};

const myfun = defFun((a, b) => a + b, ['number', 'number']);
try {
  console.log(appFun(myfun, 4, 2));
} catch (e) {
  console.log(e.typerr);
}

// Zad 04
console.log('Zad 04');
const n = 4;

const fib = (arg) => {
  if (arg <= 0) {
    return 0;
  }
  if (arg === 1) {
    return 1;
  }
  return fib(arg - 1) + fib(arg - 2);
};

let saved = [];

const memo = (cache, fun) => {
    console.log(cache);
    console.log(fun);
};

const fibonacci = memo([0, 1], (recur, n) => recur(n - 1) + recur(n - 2));


console.log(memo(n) === fib(n));
