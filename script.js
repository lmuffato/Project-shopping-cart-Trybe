const totalPriceName = '.total-price';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const appendProducts = (items) => {
  const { results } = items;
  const mainSection = document.querySelector('.items');
  results.forEach((product) => {
    const { id, title, thumbnail } = product;
    mainSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
};

const subtractPrice = (price) => {
  const totalPrice = document.querySelector(totalPriceName);
  totalPrice.innerHTML = parseFloat((totalPrice.innerHTML - price).toFixed(2));
  localStorage.setItem('totalPrice', totalPrice.innerHTML);
};

function cartItemClickListener() {
  const cart = document.querySelector('.cart__items');
  cart.addEventListener('click', (e) => {
    const item = e.target;
    item.remove();
    const itemArray = item.innerText.split(' ');
    const toSave = !cart.innerHTML ? '' : cart.innerHTML;
    const priceToSubtract = itemArray[itemArray.length - 1].replace('$', '');
    const prices = JSON.parse(localStorage.getItem('prices'));
    const index = prices.indexOf(parseFloat(priceToSubtract));
    localStorage.setItem('cart', toSave);
    prices.splice(index, 1);  
    if (index !== -1) localStorage.setItem('prices', JSON.stringify(prices));
    subtractPrice(parseFloat(priceToSubtract));
  });
}

const sumPrices = async () => {
  const prices = JSON.parse(localStorage.getItem('prices'));
  const total = document.querySelector(totalPriceName);
  const sum = parseFloat(prices.reduce((acc, currentValue) => acc + currentValue, 0).toFixed(2));
  total.innerHTML = `${sum}`;
  localStorage.setItem('totalPrice', sum);
  return sum;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const fetchAPI = async (url) => {
  document.querySelector('.items').innerHTML = '<p class="loading">Carregando produtos...</p>';
  await fetch(url)
  .then((response) => response.json())
  .then((product) => {
  document.querySelector('.items').innerHTML = '';
  appendProducts(product);
  });
};

const getProduct = async (sku) => {
  const item = await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json()).then((product) => product);
  return item;
};

const addToCart = async (cart) => {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
      const prices = JSON.parse(localStorage.getItem('prices')) || [];
      const productSku = getSkuFromProductItem(event.target.parentNode);
      const item = await getProduct(productSku);
      const { id, title, price } = item;
      const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
      cart.appendChild(cartItem);
      prices.push(price);
      localStorage.setItem('cart', cart.innerHTML);
      localStorage.setItem('prices', JSON.stringify(prices));
      sumPrices();
    }
  });
};
  
const getCartItems = (cart) => {
  const cartItems = cart;
  cartItems.innerHTML = localStorage.getItem('cart');
  const totalPrice = localStorage.getItem('totalPrice');
  const total = document.querySelector(totalPriceName);
  total.innerHTML = total.innerHTML !== null ? `${totalPrice || 0}` : 0;
};

const emptyCart = (cart) => {
  const cartItems = cart;
  const totalPrice = document.querySelector(totalPriceName);
  const btnClean = document.querySelector('.empty-cart');
  btnClean.addEventListener('click', () => {
    cartItems.innerHTML = '';
    totalPrice.innerHTML = 0;
    localStorage.removeItem('prices');
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('cart');
  });
};
  
window.onload = function onload() {
  fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  
  const cart = document.querySelector('.cart__items');
  
  addToCart(cart);
  getCartItems(cart);
  cartItemClickListener();
  emptyCart(cart);
};
