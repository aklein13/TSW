let text = 'Ala i As poszli w las';
const re = /(\s[aiouwz][\s\t\n])/g;
text = text.replace(re, (match, word) => word.slice(0, -1) + '&nbsp;');
console.log(text);
