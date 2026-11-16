$(document).ready(function () {
  const $links = $('nav a[href^="#"]:not(.brand)');
  $(window).on('scroll', function () {
    const y = $(this).scrollTop() + 90;
    $('#top').toggle($(this).scrollTop() > 400);
    $links.removeClass('on').each(function () {
      const $t = $($(this).attr('href'));
      if ($t.length && $t.offset().top <= y && $t.offset().top + $t.outerHeight() > y) $(this).addClass('on');
    });
  });
  $('#top').on('click', () => $('html,body').animate({ scrollTop: 0 }, 400));
  $.ajax({ url: 'https://dummyjson.com/quotes/random', method: 'GET', dataType: 'json',
    success: d => $('#quote').text('“' + d.quote + '” — ' + d.author),
    error: () => $('#quote').text('Innovation starts with a problem worth solving.') });
});
