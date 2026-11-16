$(document).ready(function () {
  // Blinking college name (toggle visibility every 500 ms)
  setInterval(function () { $('#college').toggleClass('blink-off'); }, 500);

  // Landmark info on click
  $('#marks li').on('click', function () {
    $('#info').hide().text($(this).data('info')).fadeIn(250);
  });

  // Visit counter using localStorage
  let v = parseInt(localStorage.getItem('nagpurVisits')) || 0;
  v++; localStorage.setItem('nagpurVisits', v); $('#visits').text(v);

  // AJAX quote
  function loadQuote() {
    const $b = $('#qBtn').prop('disabled', true); $('#quote').text('Loading…');
    $.ajax({ url: 'https://dummyjson.com/quotes/random', method: 'GET', dataType: 'json',
      success: d => $('#quote').text('“' + d.quote + '” — ' + d.author),
      error: () => $('#quote').text('Could not load quote. Check your internet connection.'),
      complete: () => $b.prop('disabled', false) });
  }
  $('#qBtn').on('click', loadQuote); loadQuote();
});
