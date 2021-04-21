// const fetch = require('node-fetch');
let cartList;

const getData = () => (
  new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
    .then((products) => resolve(products.results.map((product) => 
    ({ sku: product.id, name: product.title, image: product.thumbnail }))))
  .catch((err) => reject(err));
  })
);

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

function createProductItemElement({ id, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const item = event.target;
  const parent = item.parentElement;
  const cart = JSON.parse(localStorage.getItem('CartList'));
  const arrOfIndex = Object.keys(parent.children);
  const itemIndex = parseInt(arrOfIndex.find((index) => parent.children[index] === item), 10);
  cart.splice(itemIndex, 1);
  localStorage.setItem('CartList', JSON.stringify(cart));
  item.parentElement.removeChild(item);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addToCart = ({ sku }) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json())
  .then((response) => ({ sku: response.id, name: response.title, salePrice: response.price }))
  .then((computerInfos) => {
    document.querySelector('.cart__items').appendChild(createCartItemElement(computerInfos));
    let cart = [];
    if (JSON.parse(localStorage.getItem('CartList')).length !== 0) {
      cart = JSON.parse(localStorage.getItem('CartList'));
    }
    cart.push(computerInfos);
    localStorage.setItem('CartList', JSON.stringify(cart));
  });
};

const fillHtmlWithProducts = async () => {
  try {
  const computers = await getData();
  computers.forEach((computer) => {
    const item = createProductItemElement(computer);
    item.lastElementChild.addEventListener('click', () => addToCart(computer));
    document.querySelector('.items').appendChild(item);
  });
  } catch (err) {
    console.log(err);
  }
};

const loadCartItems = () => {
  cartList = JSON.parse(localStorage.getItem('CartList'));
  if (cartList.length !== 0) {
    cartList.forEach((item) =>
    document.querySelector('.cart__items').appendChild(createCartItemElement(item)));
  }
};

window.onload = function onload() {
  fillHtmlWithProducts();
  loadCartItems();
};