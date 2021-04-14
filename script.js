window.onload = function onload() { };

const ul = document.querySelector('.cart__items');
const pPrice = document.querySelector('.total-price');

const updateStorage = () => {
  localStorage.setItem('cart', ul.innerHTML);
  localStorage.setItem('priceCart', pPrice.innerHTML);
};

const sumPrices = (acc, element) => {
  const arr = element.innerText.split('$');
  const price = Number(arr[1]);
  const total = acc + price;
  return total;
};

const updatePrice = async () => {
  const items = document.querySelectorAll('li.cart__item');
  const totalPrice = [...items].reduce(sumPrices, 0);
  pPrice.innerText = totalPrice;
};

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getIdFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener({ target }) {
  target.remove();
  updatePrice();
  updateStorage();
}

const loadStorage = () => {
  pPrice.innerHTML = localStorage.getItem('priceCart');
  ul.innerHTML = localStorage.getItem('cart');
  document
    .querySelectorAll('.cart__item')
    .forEach((e) => e.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchPC = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  return data;
};

const fetchCart = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  return data;
};

const getPcs = ({ results }) => {
  results.forEach((result) => {
    document
      .querySelector('.items')
      .appendChild(createProductItemElement(result));
  });
};

const clickToCart = async () => {
  document.querySelectorAll('.item__add').forEach((e) =>
    e.addEventListener('click', async () => {
      try {
        const data = await fetchCart(getIdFromProductItem(e.parentNode));
        ul.appendChild(createCartItemElement(data));
        updatePrice();
        updateStorage();
      } catch (error) {
        console.log('Deu ruim :(');
      }
    }));
};

const clickToRemove = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    ul.innerHTML = '';
    updatePrice();
    updateStorage();
  });
};

const removeLoading = () => document.querySelector('.loading').remove();

const getData = async () => {
  try {
    getPcs(await fetchPC());
    removeLoading();
    await clickToCart();
    clickToRemove();
  } catch (error) {
    console.log('Deu ruim :(');
  }
};

getData();
loadStorage();