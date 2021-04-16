let itemsInfoBackup = JSON.parse(localStorage.getItem('cartItems')) || [];

function totalPrice() {
  const total = itemsInfoBackup.reduce((acc, curr) => acc + curr.salePrice, 0);
  
  document.querySelector('.total-price').innerHTML = total;
}

function defineCartItemsListConstant() {
  const cartItemsList = document.querySelector('.cart__items');
  return cartItemsList;
}

function cartItemClickListener(event) {
  const cartListEl = defineCartItemsListConstant();
  const itemToBeRemoved = event.target;
  const infoArray = itemToBeRemoved.innerText.split('|');
  const sku = infoArray[0].split(':')[1].trim();
  const matchEl = itemsInfoBackup.find((el) => el.sku === sku);
  itemsInfoBackup.splice(itemsInfoBackup.indexOf(matchEl), 1);
  localStorage.setItem('cartItems', JSON.stringify(itemsInfoBackup));
  cartListEl.removeChild(itemToBeRemoved);
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyShoppingCart() {
  localStorage.setItem('cartItem', []);
  itemsInfoBackup = [];
  document.querySelectorAll('.cart__item').forEach((el) => el.remove());
  totalPrice();
}

function loadCartFromStorage() {
  const cartListEl = defineCartItemsListConstant();
  if (itemsInfoBackup) {
  itemsInfoBackup.forEach(({ sku, name, salePrice }) =>
    cartListEl.appendChild(createCartItemElement({ sku, name, salePrice })));
  } else {
    return 0;
  }
}

async function addProducstOnCart({ sku, name, salePrice }) {
  const cartListEl = defineCartItemsListConstant();
  itemsInfoBackup.push({ sku, name, salePrice });
  cartListEl.appendChild(createCartItemElement({ sku, name, salePrice }));
  
  localStorage.setItem('cartItems', JSON.stringify(itemsInfoBackup));
  totalPrice();
}

function setLoadingPage(isEnabled) {
  const loadingPageEl = document.querySelector('.loadingPage');
  if (isEnabled) {
    const loadingText = document.createElement('p');
    loadingText.className = 'loading';
    loadingText.innerText = 'Loading';
    loadingPageEl.appendChild(loadingText);
    loadingPageEl.className = 'loadingPage on';
  } else {
    const newLoadingPage = document.querySelector('.loadingPage.on');
    const loadingText = document.querySelector('.loadingPage.on p');
    newLoadingPage.removeChild(loadingText);
    newLoadingPage.className = 'loadingPage';
  }
}

async function productListItemClickListener(event) {
  setLoadingPage(true);
  const cardItemProduct = event.target.parentElement;
  const itemProductId = cardItemProduct.childNodes[0].innerText;
  
  const { price, id, title } = await fetch(`https://api.mercadolibre.com/items/${itemProductId}`)
    .then((res) => res.json())
      .then((item) => item);
  
  addProducstOnCart({ sku: id, name: title, salePrice: price });
  setLoadingPage(false);
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

async function addProductsOnList() {
  setLoadingPage(true);
  const itemsListEl = document.querySelector('.items');
  const apiRequestedItens = await
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
      .then((response) => response.json())
        .then((data) => data.results);

  await apiRequestedItens.forEach(({ id, title, thumbnail }) =>
  itemsListEl.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
  const listedProductsButtons = document.querySelectorAll('.item button');
  listedProductsButtons.forEach((button) => button.addEventListener('click', 
    (e) => productListItemClickListener(e)));
  setLoadingPage(false);
}

window.onload = function onload() { 
  addProductsOnList();
  loadCartFromStorage();
  totalPrice();
  document.querySelector('button.empty-cart').addEventListener('click', emptyShoppingCart);
};
