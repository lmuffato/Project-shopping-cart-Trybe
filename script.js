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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function showComputers() {
  const fatherSection = document.getElementsByClassName('items')[0];
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  data.results.forEach((result) => {
    fatherSection.appendChild(createProductItemElement(result));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const parent = event.target.parentNode;
  parent.removeChild(event.target); 
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const parent = event.target.parentNode;
  const getSku = getSkuFromProductItem(parent);
  const ol = document.querySelector('.cart__items');
  const response = await fetch(`https://api.mercadolibre.com/items/${getSku}`);
  const data = await response.json();
  const cartItem = createCartItemElement(data);
  ol.appendChild(cartItem);
}

const addEventListener1 = async () => {
  await showComputers();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => addToCart(event));
  });
};

window.onload = function onload() {
  addEventListener1();
};
