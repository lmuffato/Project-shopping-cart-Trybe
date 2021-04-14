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

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProducts = () => {
  const item = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  return fetch(url)
  .then((response) => response.json())
  .then((data) => data.results);
};

async function fetchProduct() {
  const items = await getProducts();
  items.forEach((item) => {
    const paramObj = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const product = createProductItemElement(paramObj);
    document.querySelector('.items').appendChild(product);
  });
}

const getItem = (itemId) => fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json());

async function appendShoppingCart(event) {
  const parent = event.target.parentNode;
  const myItem = parent.querySelector('span.item__sku').innerText;
  const myJson = await getItem(myItem);
  const paramObj = {
    sku: myJson.id,
    name: myJson.title,
    salePrice: myJson.price,
  };
  const cartElement = createCartItemElement(paramObj);
  document.querySelector('.cart__items').appendChild(cartElement);
}

const addListener = () => {
  document.querySelector('.items').addEventListener('click', appendShoppingCart);
};

window.onload = function onload() {
  fetchProduct();
  addListener();
};
