$(() => {
  let previousSelected;
  const input = '<input type="text"/>';
  let previousValue;
  $(this).keydown(function (e) {
    const element = $('.yellow');
    if (element && e.key === 'ArrowUp') {
      $(element).prev().before(element);
      $('input').focus();
    }
    else if (element && e.key === 'ArrowDown') {
      $(element).next().after(element);
      $('input').focus();
    }
  });
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
    });
  });
});
