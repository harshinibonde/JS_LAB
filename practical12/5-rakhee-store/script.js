$(document).ready(function () {
  const PRODUCTS = [
    { id: 1, n: 'Kundan Rakhi', c: 'rakhi', p: 149, e: '🧿', d: 'Gold-tone with kundan stones' },
    { id: 2, n: 'Rudraksha Rakhi', c: 'rakhi', p: 99, e: '📿', d: 'Sacred beads on silk thread' },
    { id: 3, n: 'Pearl Bracelet Rakhi', c: 'rakhi', p: 199, e: '🪬', d: 'Wearable long after the festival' },
    { id: 4, n: 'Kaju Katli Box', c: 'sweet', p: 449, e: '🍬', d: '500 g, made in pure ghee' },
    { id: 5, n: 'Motichoor Laddoo', c: 'sweet', p: 349, e: '🟠', d: '500 g, fresh and soft' },
    { id: 6, n: 'Dry Fruit Hamper', c: 'gift', p: 899, e: '🥜', d: 'Almonds, cashews, raisins, figs' },
    { id: 7, n: 'Brass Diya Set', c: 'gift', p: 549, e: '🪔', d: 'Set of 4 hand-polished diyas' },
    { id: 8, n: 'Thali & Roli Kit', c: 'gift', p: 299, e: '🪙', d: 'Embroidered thali with roli-chawal' }];
  const KEY = 'rakheeCart';
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { cart = {}; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(cart));
  const find = id => PRODUCTS.find(p => p.id === id);

  function showGrid(cat) {
    const $g = $('#grid').empty();
    PRODUCTS.filter(p => cat === 'all' || p.c === cat).forEach(p => $g.append(
      `<div class="p"><div class="em">${p.e}</div><h4>${p.n}</h4><small>${p.d}</small><div class="pr">₹${p.p}</div><button class="add" data-id="${p.id}">Add to cart</button></div>`));
  }
  function drawCart() {
    const $i = $('#items').empty(); let sum = 0, count = 0;
    Object.keys(cart).forEach(id => { const p = find(+id), q = cart[id]; sum += p.p * q; count += q;
      $i.append(`<div class="ci"><span>${p.e}</span><div class="n">${p.n}<br><small>₹${p.p}</small></div>
        <button class="mi" data-id="${id}">−</button><b>${q}</b><button class="pl" data-id="${id}">+</button></div>`); });
    if (!count) $i.html('<p>Your cart is empty. Add a rakhi to begin.</p>');
    $('#sum').text('₹' + sum); $('#cnt').text(count);
  }
  function open(o) { $('#drawer').toggleClass('open', o); $('#veil').toggleClass('on', o); }

  $('.f').on('click', function () { $('.f').removeClass('on'); $(this).addClass('on'); showGrid($(this).data('c')); });
  $('#grid').on('click', '.add', function () {
    const id = $(this).data('id'); cart[id] = (cart[id] || 0) + 1; save(); drawCart();
    $('#cartBtn').animate({ opacity: .4 }, 100).animate({ opacity: 1 }, 100);
  });
  $('#items').on('click', '.pl,.mi', function () {
    const id = $(this).data('id'); cart[id] += $(this).hasClass('pl') ? 1 : -1;
    if (cart[id] <= 0) delete cart[id]; save(); drawCart();
  });
  $('#cartBtn').on('click', () => open(true)); $('#close,#veil').on('click', () => open(false));
  $('#chk').on('click', function () {
    if (!Object.keys(cart).length) return $('#note').text('Add something to your cart first.');
    if (!/^[1-9]\d{5}$/.test($('#pin').val())) return $('#note').text('Enter a valid 6-digit pincode.');
    cart = {}; save(); drawCart(); $('#pin').val(''); $('#note').text('Order placed! Your rakhis will reach on time. 🎉');
  });
  function wish() {
    $('#wish').text('Loading…');
    $.ajax({ url: 'https://dummyjson.com/quotes/random', method: 'GET', dataType: 'json',
      success: d => $('#wish').text('“' + d.quote + '”'),
      error: () => $('#wish').text('Meri pyaari bhai ke liye: tum sada khush raho, surakshit raho.') });
  }
  $('#wBtn').on('click', wish);
  showGrid('all'); drawCart(); wish();
});
