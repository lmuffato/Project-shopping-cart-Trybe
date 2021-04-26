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

const verifiedFetch = async (url) => {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
      .then((r) => r.json())
      .then((r) => (r));
  }
  throw new Error('endpoint não existe');
};

const asd = async (selectedId) => {
  const cartItem = document.querySelector('.cart__items');
  const product = await fetch(`https://api.mercadolibre.com/items/${selectedId}`)
    .then((r) => r.json())
    .then((r) => r);
  cartItem.appendChild(createCartItemElement(product));
};

const sla = async () => {
  const a = document.querySelectorAll('.item__add');
  let selectedId;
  a.forEach((element) => element.addEventListener('click', (e) => {
    const id = e.target.previousElementSibling.previousElementSibling
    .previousElementSibling.innerText;
    selectedId = id;
    asd(selectedId);
  }));
};

const execute = async () => {
  const feti = await verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const result = feti.results;
  const items = document.querySelector('.items'); 
  result.forEach((element) => items.appendChild(createProductItemElement(element)));
  sla();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  execute();
};