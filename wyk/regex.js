function insertString() {
  const content = document.getElementById('content');
  if (!content) {
    return;
  }

  const data = {
    first: 'Jan',
    last: 'Kowalski',
    border: 2,
  };

  // Match for {word}
  const re = /{([^}]+)?}/g;

  let template =
    '<table border="{border}">' +
    ' <tr><td>{first}</td><td>{last}</td></tr>' +
    '</table>';

  // Args from replace: match, matched word, position, whole string
  template = {value: template, supplant: (data) => template.value.replace(re, (match, word) => data[word])};

  content.innerHTML = template.supplant(data);
}
