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

const fetchAPI = async (url) => 
  fetch(url)
    .then((response) => response.json())
    .then((product) => product);

const appendProducts = async () => {
  const items = await fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((products) => products);
  const { results } = items;
  const mainSection = document.querySelector('.items');
  results.forEach((product) => {
    const { id, title, thumbnail } = product;
    mainSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
};

function cartItemClickListener(event, cart) {
  const item = event.target;
  item.remove();
  const toSave = !cart.innerHTML ? '' : cart.innerHTML;
  localStorage.setItem('cart', toSave);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    const cart = document.querySelector('.cart__items');
    cartItemClickListener(event, cart);
  });
  return li;
}

const addToCart = async (cart) => {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
      const item = await fetchAPI(`https://api.mercadolibre.com/items/${
        getSkuFromProductItem(event.target.parentNode)}`);
      const { id, title, price } = item;
      const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
      cart.appendChild(cartItem);
      localStorage.setItem('cart', cart.innerHTML);
    }
  });
};

const getCartItems = (cart) => {
  const cartItems = cart;
  cartItems.innerHTML = localStorage.getItem('cart');
  cartItems.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      cartItemClickListener(event, cartItems);
    }
  });
};

window.onload = function onload() {
  appendProducts();

  const cart = document.querySelector('.cart__items');

  addToCart(cart);
  getCartItems(cart);
};
