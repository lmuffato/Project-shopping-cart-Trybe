async function sumValues() {
  const values = document.querySelectorAll('.cart__item');
  const valuesToArray = [...values];
  const x = valuesToArray.map((liValue) => {
    const searchIndex = liValue.innerText.indexOf('$');
    return liValue.innerText.substring(searchIndex + 1);
  });
  document.querySelector('.total-price')
    .innerText = x.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

 function cartItemClickListener(event) {
  event.target.remove();
  sumValues();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function listOfProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  return data.results.map((product) =>
    ({ sku: product.id, name: product.title, image: product.thumbnail }));
}

async function itemForItemCart(itemId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await response.json();
  const { id, title, price } = data;
  const result = { id, title, price };
  return result;
}

async function addToCart(event) {
  const idProduct = getSkuFromProductItem(event.target.parentNode);
  const x = await itemForItemCart(idProduct);
  const li = createCartItemElement(x);
  document.querySelector('.cart__items').appendChild(li);
  sumValues();
}

async function makeProduct() {
  const computadores = await listOfProducts();
  computadores.forEach((computador) => {
    const item = createProductItemElement(computador);
    item.addEventListener('click', addToCart);
    document.querySelector('.items').appendChild(item);
  });
}

window.onload = async function onload() {
  makeProduct();
};
