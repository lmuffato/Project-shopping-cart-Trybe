// const fetch = require('node-fetch');

/* const fetchProduct = (url) => {
  return new Promise((resolve, reject) => {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      fetch(url)
        .then(response => response.json())
        .then(data => console.log(data));
    } else {
      reject( new Error ('endpoint não encontrado'));
    }
  });
} */

const sum = { sku: [], price: [] };
const totalPriceElem = document.createElement('p');
let totalPrice;

const changePrice = (arrayOfPrices) => {
  console.log(arrayOfPrices);
  if (arrayOfPrices !== null) {
    totalPrice = arrayOfPrices.reduce((acc, value) => acc + value, 0);
  }
  // console.log(totalPrice);
  document.querySelector('.cart').appendChild(totalPriceElem);
  totalPriceElem.innerText = `Total = ${totalPrice}`;

  localStorage.setItem('prices', JSON.stringify(arrayOfPrices));
  // console.log(JSON.parse(localStorage.getItem('prices')));
};

const updateTotalPrice = (sku, salePrice, change) => {
  if (change === 'sum') {
    sum.sku.push(sku);
    sum.price.push(salePrice);
    console.log(sum);
    changePrice(sum.price);
  } else {
    const indexItemToRemove = sum.sku.findIndex((item) => {
      return item === sku;
    });
    sum.sku.splice(indexItemToRemove, 1);
    sum.price.splice(indexItemToRemove, 1);
    changePrice(sum.price);
  }
};

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
  // coloque seu código aqui
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  localStorage.setItem('listProducts', cartList.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => updateTotalPrice(sku, salePrice, 'deduct'));
  li.addEventListener('click', cartItemClickListener);
  updateTotalPrice(sku, salePrice, 'sum');
  return li;
}

const fechProductById = async (itemId) => {
  const URL = `https://api.mercadolibre.com/items/${itemId}`;
  const dataFetch = await fetch(URL);
  const data = await dataFetch.json();

  const cartList = document.querySelector('.cart__items');

  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };

  const itemList = createCartItemElement(obj);
  cartList.appendChild(itemList);

  localStorage.setItem('listProducts', cartList.innerHTML);
};

function productClickListener(event) {
  // coloque seu código aqui
  const id = getSkuFromProductItem(event.target.parentNode);
  fechProductById(id);
}

const clickButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) =>
    button.addEventListener('click', productClickListener));
};

const fetchProducts = async () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const dataFetch = await fetch(URL);
  const data = await dataFetch.json();

  const sectionItems = document.querySelector('.items');

  data.results.forEach(({ id, title, thumbnail }) => {
    const obj = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    const item = createProductItemElement(obj);
    sectionItems.appendChild(item);
  });

  clickButton();
};

const getItemsStorage = () => {
  const savedItems = localStorage.getItem('listProducts');
  const savedCart = document.querySelector('.cart__items');
  savedCart.innerHTML = savedItems;

  savedCart.childNodes.forEach((item) =>
    item.addEventListener('click', cartItemClickListener));
  };
  
  window.onload = function onload() {
    fetchProducts();
    getItemsStorage();
    console.log(JSON.parse(localStorage.getItem('prices')));
    //console.log(localStorage.getItem('prices'));
    changePrice(JSON.parse(localStorage.getItem('prices')));
};
