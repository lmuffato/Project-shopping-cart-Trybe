function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(itemId) {
  const fetchItem = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await fetchItem.json();

  const cartItem = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const createCartList = createCartItemElement(cartItem);
  document.querySelector('.cart__items').appendChild(createCartList);
}

function addToCartClickListener(event) {
  const getitemId = getSkuFromProductItem(event.target.parentNode);
  addToCart(getitemId);
}

function ClickAddToCartButton() {
  const addToCartButton = document.querySelectorAll('.item__add');
  addToCartButton.forEach((button) =>
    button.addEventListener('click', addToCartClickListener));
}

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

async function fetchItems() {
  const fetchApi = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const getJson = await fetchApi.json();
  const getItems = getJson.results;
  
  getItems.forEach(({ id, title, thumbnail }) => {
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const creatItem = createProductItemElement(item);
    document.querySelector('.items').appendChild(creatItem);
  });
  ClickAddToCartButton();
}

window.onload = function onload() {
  fetchItems();
};
