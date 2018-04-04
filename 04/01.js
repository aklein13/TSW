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

const myFun = defFun((a, b) => a + b, ['number', 'number']);
try {
  console.log(appFun(myFun, 4, 2));
} catch (e) {
  console.log(e.typerr);
}

// Zad 03 is in ../wyk/regex.js
