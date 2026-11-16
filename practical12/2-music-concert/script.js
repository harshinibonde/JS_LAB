$(document).ready(function () {
  const ZONES = [
    { id: 'silver', name: 'Silver · General', price: 799, note: 'Standing, open area' },
    { id: 'gold', name: 'Gold · Seated', price: 1499, note: 'Reserved seat, side view' },
    { id: 'plat', name: 'Platinum · Front', price: 2999, note: 'Front rows, meet & greet entry' }];
  const KEY = 'sargamTickets';
  let qty = { silver: 0, gold: 0, plat: 0 }, tickets = [];
  try { tickets = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { tickets = []; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(tickets));

  ZONES.forEach(z => $('#zones').append(`<div class="zone" data-id="${z.id}"><div><h4>${z.name}</h4><small>${z.note}</small></div>
    <div class="ctr"><span class="price">₹${z.price}</span><button class="m">−</button><span class="q">0</span><button class="p">+</button></div></div>`));

  function calc() {
    let sub = 0, html = '';
    ZONES.forEach(z => { const q = qty[z.id]; sub += q * z.price;
      $(`.zone[data-id=${z.id}]`).toggleClass('active', q > 0).find('.q').text(q);
      if (q) html += `<div class="ln"><span>${z.name.split(' ·')[0]} × ${q}</span><span>₹${q * z.price}</span></div>`; });
    const fee = Math.round(sub * 0.05);
    $('#lines').html(html || '<p class="muted">Add tickets to begin.</p>');
    $('#fee').text('₹' + fee); $('#grand').text('₹' + (sub + fee));
    return { sub, fee, grand: sub + fee };
  }
  $('#zones').on('click', '.p,.m', function () {
    const id = $(this).closest('.zone').data('id'), d = $(this).hasClass('p') ? 1 : -1;
    const all = Object.values(qty).reduce((a, b) => a + b, 0);
    if (d > 0 && all >= 10) return $('#err').text('Maximum 10 tickets per booking.');
    qty[id] = Math.max(0, qty[id] + d); $('#err').text(''); calc();
  });
  $('#search').on('input', function () {
    const t = $(this).val().toLowerCase();
    $('.zone').each(function () { $(this).toggle($(this).text().toLowerCase().includes(t) || t.length === 0); });
  });
  $('#cnt').text(tickets.length);

  $('#pay').on('click', function () {
    const c = calc(), n = $('#n').val().trim(), e = $('#e').val().trim(), p = $('#p').val().trim();
    if (!c.sub) return $('#err').text('Select at least one ticket.');
    if (n.length < 3) return $('#err').text('Enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(e)) return $('#err').text('Enter a valid email.');
    if (!/^[6-9]\d{9}$/.test(p)) return $('#err').text('Mobile must be 10 digits.');
    const t = { id: 'SL' + Date.now().toString().slice(-7), name: n, email: e, items: ZONES.filter(z => qty[z.id]).map(z => `${z.name.split(' ·')[0]} × ${qty[z.id]}`), total: c.grand };
    tickets.unshift(t); save(); $('#cnt').text(tickets.length); $('#err').text('');
    showTicket(t, 'Booking confirmed 🎉');
    qty = { silver: 0, gold: 0, plat: 0 }; $('#n,#e,#p').val(''); calc();
  });
  function showTicket(t, title) {
    $('#boxBody').html(`<h3>${title}</h3><div class="tkt"><h4>Raga Reloaded — Live</h4><small>20 Dec 2026 · 7 PM · VCA Ground</small>
      <p><b>${t.id}</b><br>${t.items.join(', ')}<br>Paid: ₹${t.total}</p><small>${t.name} · ${t.email}</small></div>`);
    $('#modal').addClass('on');
  }
  $('#myBtn').on('click', function () {
    if (!tickets.length) { $('#boxBody').html('<h3>My tickets</h3><p>No tickets yet.</p>'); }
    else { $('#boxBody').html('<h3>My tickets</h3>' + tickets.map(t => `<div class="tkt"><h4>${t.id}</h4><small>${t.items.join(', ')} · ₹${t.total}</small></div>`).join('')); }
    $('#modal').addClass('on');
  });
  $('.x').on('click', () => $('#modal').removeClass('on'));
  $('#modal').on('click', function (e) { if (e.target === this) $(this).removeClass('on'); });

  function quote() {
    $('#quote').text('Loading…');
    $.ajax({ url: 'https://dummyjson.com/quotes/random', method: 'GET', dataType: 'json',
      success: d => $('#quote').text(d.quote + ' — ' + d.author),
      error: () => $('#quote').text('Quote unavailable right now. Check your connection.') });
  }
  $('#q').on('click', quote); quote(); calc();
});
