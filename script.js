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

async function computerResults() {
  const fetchLink = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => response.results);
  fetchLink.forEach((product) => {
    const searchResult = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    const fatherElement = document.querySelector('.items');
    fatherElement.appendChild(searchResult);
  });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function addCartClickListener(event) {
  const elementFather = document.querySelector('.cart__items');
  const elementChild = event.target;
  elementFather.removeChild(elementChild);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', addCartClickListener);
  return li;
}

const itemGet = (itemId) =>
  fetch(`https://api.mercadolibre.com/items/${itemId}`).then((response) => response.json());

async function apShopCart(id) {
  const parent = id.target.parentNode;
  const myItem = parent.querySelector('span.item__sku').innerText;
  const jsonConst = await itemGet(myItem);
  const obj = {
    sku: jsonConst.id,
    name: jsonConst.title,
    salePrice: jsonConst.price,
  };
  const cart = createCartItemElement(obj);
  document.querySelector('.cart__items').appendChild(cart);
}

const eventListener = () => {
  document.querySelector('.items').addEventListener('click', apShopCart);
};

window.onload = function onload() {
  computerResults();
  eventListener();
};