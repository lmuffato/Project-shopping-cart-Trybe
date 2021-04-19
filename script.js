// const { default: fetch } = require('node-fetch');

const cartItemsConst = '.cart__items'; // Requerido pelo eslit pois a string estava sendo utilizada mais de 3 vezes. 

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

const loadingMsg = () => {
  const loading = document.createElement('h1');
  loading.classList = 'loading';
  loading.innerText = 'Loading...';
  const containerItems = document.querySelector('.items');
  containerItems.appendChild(loading);
};

const fetchProducts = async (product) => {
  loadingMsg();
  const endpointpcs = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const response = await fetch(endpointpcs);
  const data = await response.json();
  // console.log(data.results);
  document.querySelector('.loading').remove();
  return data.results.forEach((element) => {
    createProductItemElement(element);
  });    
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
  
const fetchPcIds = async (pcId) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${pcId}`);
  const pcIdData = await response.json();
  return pcIdData;
};
// console.log(fetchPcIds());

function cartItemClickListener(event) { // Seleciona o produto como evento e remove da lisata do carrinho de compras.
  event.target.remove();
}

function createCartItemElement({ sku: id, name: title, salePrice }) {
  const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
}

const localStorageCart = () => { // será adicionado junto com o produto ao carrinho de compras 
  const shoppingCartItems = document.querySelector(cartItemsConst);
  localStorage.setItem('Shopping cart', shoppingCartItems.innerHTML); // método setItem adiciona a chave e valor ao localStorage. src = https://developer.mozilla.org/pt-BR/d
};

const showCartOnLoad = () => { // será mostrado após ser recuperado do localStorage.
  const shoppingCartItems = document.querySelector(cartItemsConst);
  shoppingCartItems.innerHTML = localStorage.getItem('Shopping cart'); // método getItem busca o valor da chave passada que foi armazenada no localStorage. src = https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/getItem
};

const addCart = async (e) => {
  const pcId = getSkuFromProductItem(e.target.parentNode);
  const data = await fetchPcIds(pcId);
  const { id, title, price } = data;

  const cart = createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  });
  const cartItems = document.querySelector(cartItemsConst);
  cartItems.appendChild(cart);
  localStorageCart(); // chamada a função para salvar o carrinho de compras no localStorage
};

const clickToCart = () => {
  const cartBtn = document.querySelectorAll('.item__add');
  cartBtn.forEach((button) => {
    button.addEventListener('click', addCart);
  });
};

const emptyCart = () => {
  const shoppingCart = document.querySelectorAll('li');
  shoppingCart.forEach((product) => {
    product.remove();
  }); 
};

const emptyBtnFunction = () => {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', emptyCart);
};

const totalPrice = async () => {
  const price = document.querySelectorAll('li');
  price.forEach((item) => {
    let prices = item.textContent;
    prices = (prices.split(' ')).reverse();
    // eslint-disable-next-line prefer-destructuring
    prices = prices[0];
    prices = [prices.replace('$', '')];
    return prices;
   });
};

window.onload = function onload() { 
  fetchProducts('computador')
    .then(() => clickToCart());
    emptyBtnFunction();
    showCartOnLoad();
    totalPrice();   
};