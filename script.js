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

function cartItemClickListener(event) {
  return event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
window.onload = function onload() {
  appendProductsObject();
};