$(document).ready(function () {
  const KEY = 'codecampBookings';
  let bookings = [];
  try { bookings = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { bookings = []; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(bookings));

  function total() {
    const price = Number($('#track option:selected').data('price')) || 0;
    const qty = Math.max(1, parseInt($('#qty').val()) || 1);
    const t = (price + ($('#lunch').prop('checked') ? 150 : 0)) * qty;
    $('#total').text('₹' + t); return t;
  }
  function render() {
    const $l = $('#list').empty();
    if (!bookings.length) return $l.append('<li class="empty">No bookings yet.</li>');
    bookings.forEach(b => $l.append(
      `<li><button class="del" data-id="${b.id}" title="Cancel">×</button><b>${b.track}</b>
      <small></small></li>`).find('small').last().text(`${b.name} · ${b.qty} ticket(s) · ₹${b.total} · ${b.id}`));
  }
  function msg(t, ok) { $('#msg').text(t).toggleClass('ok', !!ok); }

  $('#track,#qty,#lunch').on('change input', total);
  $('#bookForm').on('submit', function (e) {
    e.preventDefault();
    $('.bad').removeClass('bad');
    const f = { name: $('#name').val().trim(), email: $('#email').val().trim(), phone: $('#phone').val().trim(),
      college: $('#college').val().trim(), year: $('#year').val(), branch: $('#branch').val(), track: $('#track').val() };
    let err = '';
    ['name','college','year','branch','track'].forEach(k => { if (!f[k]) { $('#' + k).addClass('bad'); err = 'Please fill the highlighted fields.'; } });
    if (!/^\S+@\S+\.\S+$/.test(f.email)) { $('#email').addClass('bad'); err = err || 'Enter a valid email address.'; }
    if (!/^[6-9]\d{9}$/.test(f.phone)) { $('#phone').addClass('bad'); err = err || 'Mobile number must be 10 digits.'; }
    const qty = parseInt($('#qty').val());
    if (!(qty >= 1 && qty <= 5)) { $('#qty').addClass('bad'); err = err || 'You can book 1 to 5 tickets.'; }
    if (err) return msg(err);
    const b = Object.assign(f, { id: 'CC' + Date.now().toString().slice(-6), qty, total: total(),
      laptop: $('input[name=laptop]:checked').val(), lunch: $('#lunch').prop('checked'), notes: $('#notes').val() });
    bookings.unshift(b); save(); render(); this.reset(); total();
    msg('Booked! Your ticket ID is ' + b.id, true);
  });
  $('#list').on('click', '.del', function () {
    const id = $(this).data('id'); bookings = bookings.filter(b => b.id !== id); save(); render();
  });
  $('#clear').on('click', () => { bookings = []; save(); render(); });
  $('#getQuote').on('click', function () {
    const $b = $(this).prop('disabled', true);
    $('#quote').text('Loading…');
    $.ajax({ url: 'https://dummyjson.com/quotes/random', method: 'GET', dataType: 'json',
      success: d => $('#quote').text('“' + d.quote + '” — ' + d.author),
      error: () => $('#quote').text('Could not load a quote. Check your internet connection.'),
      complete: () => $b.prop('disabled', false) });
  });
  render(); total();
});
