const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  console.log({ sku, name, salePrice });
  return li;
}

function getProducts() {
  const products = fetch(API_URL)
  .then((response) => response.json())
  .then((response) => response.results);
  
  return products;
}

async function setItem(event) {
  const e = event.target;
  const cart = document.querySelector('.cart__items');
  const itemId = e.parentElement.firstChild.textContent;
  const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
  const { id: sku, title: name, price: salePrice } = await fetch(itemUrl)
  .then((response) => response.json())
  .then((response) => response);
  
  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
}

function itemAddEvent() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', setItem));
}

async function showProducts() {
  const products = await getProducts();
  const sectionItems = document.querySelector('.items');
  
  products.forEach(({ id: sku, title: name, thumbnail_id: imageId }) => {
    // https://trybecourse.slack.com/archives/C01L16B9XC7/p1618509977348900
    const image = `https://http2.mlstatic.com/D_NQ_NP_${imageId}-O.webp`;
    
    sectionItems.appendChild(createProductItemElement({ sku, name, image }));
  });

  itemAddEvent();
}

window.onload = () => {
  showProducts();
  // setItem();
 };