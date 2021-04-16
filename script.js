const API_URL_PC = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const API_URL_ID = 'https://api.mercadolibre.com/items/';

const fetchAPI = (URL, key) => new Promise((resolve, reject) => {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => resolve(data[key]))
    .catch(reject);
});

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

const createProductObject = (item) => ({ sku: item.id, name: item.title, image: item.thumbnail });

const updatePrice = (salePrice) => {
  const price = document.getElementById('price');
  const newPrice = parseFloat(price.innerText) + salePrice;
  price.innerText = newPrice;
  localStorage.setItem('preco', newPrice);
};

function cartItemClickListener(event) {
  const text = event.target.innerText;
  const indexOf = text.indexOf('|');
  const indexOf$ = text.indexOf('$');
  const price = text.slice(indexOf$ + 1);
  updatePrice(price * -1);
  localStorage.removeItem(text.slice(5, indexOf - 1));
  return event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  updatePrice(salePrice);
  return li;
}

const itemClick = () => {
  const buttons = document.querySelectorAll('.item__add');
  const ol = document.querySelector('.cart__items');
  buttons.forEach((button, index) => {
    const sku = document.querySelectorAll('.item__sku')[index].innerText;
    const name = document.querySelectorAll('.item__title')[index].innerText;
    button.addEventListener('click', async () => {
      const salePrice = await fetchAPI(`${API_URL_ID}${sku}`, 'price');
      const li = createCartItemElement({ sku, name, salePrice });
      ol.appendChild(li);
      localStorage.setItem(`${sku}`, li.innerText);
    });
  });
};

const appendProductsObject = async () => {
  const items = document.getElementsByClassName('items')[0];
  const array = await fetchAPI(API_URL_PC, 'results');
  array.forEach((item) => {
    const object = createProductObject(item);
    items.appendChild(createProductItemElement(object));
  });
  itemClick();
};

const createLiItem = (text) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = text;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getLocalStorage = () => {
  const itemsSize = localStorage.length;
  const price = document.getElementById('price');
  for (let index = 0; index < itemsSize; index += 1) {
    const key = localStorage.key(index);
    if (key !== 'preco') {
      const li = createLiItem(localStorage.getItem(key));
      const ol = document.querySelector('.cart__items');
      ol.appendChild(li);
    } else {
      price.innerText = localStorage.getItem(key);
    }
  }
};
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
window.onload = function onload() {
  appendProductsObject();
  getLocalStorage();
};