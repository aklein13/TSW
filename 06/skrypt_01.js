$(() => {
  let previousSelected;
  const input = '<input type="text"/>';
  let previousValue;
  $(this).click(() => previousSelected && $(previousSelected).removeClass('yellow'));
  $('tr').click(function () {
    previousSelected && $(previousSelected).removeClass('yellow');
    $(this).addClass('yellow');
    previousSelected = this;
  });
  $('table').click((e) => e.stopPropagation());
  $('td').dblclick(function () {
    $('input').replaceWith(previousValue);
    previousValue = $(this).text();
    $(this).text('').append(input);
    $('input').focus().val(previousValue).keypress(function (e) {
      e.key === 'Enter' && $(this).replaceWith($(this).val());
    }).keydown(function (e) {
      if (e.key === 'ArrowUp') {
        $(this).parent().parent().prev().before($(this).parent().parent());
        $(this).focus();
      }
      else if (e.key === 'ArrowDown') {
        $(this).parent().parent().next().after($(this).parent().parent());
        $(this).focus();
      }
    });
  });
});
