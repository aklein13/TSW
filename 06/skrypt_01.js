// Klikanie na wiersze powinno je podswietlac
// Klik poza tabelka usuwa podswietlenie
// Na strzalki sie przenosi
// Podwojne klikanie robi inputa i mozna zmienic zawartosc

$(() => {
  let previous;
  const input = '<input type="text"/>';
  let prevVal;
  $('tr').click(function () {
    if (previous) {
      console.log(previous);
      $(previous).removeClass("yellow");
    }
    $(this).addClass("yellow");
    previous = this;
  });
  $('td').dblclick(function () {
    $('input').replaceWith(`<td>${prevVal}</td>`);
    prevVal = $(this).text();
    $(this).replaceWith(input);
    $('input').val(prevVal).keypress(function (e) {
      if (e.key === 'Enter') {
        const prevVal = $(this).val();
        $(this).replaceWith(`<td>${prevVal}</td>`);
      }
      else if (e.key === 'ArrowUp') {
        console.log('up');
      }
      else if (e.key === 'ArrowDown') {
        console.log('up');
      }
    });
  });
});
