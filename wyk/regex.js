function insertString() {
  const content = document.getElementById('content');
  if (!content) {
    return;
  }
  let template =
    '<table border="{border}">' +
    ' <tr><td>{first}</td><td>{last}</td></tr>' +
    '</table>';

  const data = {
    first: 'Jan',
    last: 'Kowalski',
    border: 2,
  };

  // Match for {word} without {}
  const re = /{([^}]+)?}/g;

  // Args: match, matched word, position, whole string
  template = template.replace(re, (match, word) => data[word]);
  content.innerHTML = template;
}
