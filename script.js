let myArray = [];
const cartItems = '.cart__items';
// ---------------------------------------------------- Loading -------------------------------------------------------------------

function loading() {
  const div = document.createElement('div');
  div.classList = 'loading';
  div.innerText = 'loading...';
  const container = document.querySelector('.container');
  container.firstElementChild.appendChild(div);
}

function getOutLoading() {
  const loadingItem = document.querySelector('.loading');
  loadingItem.remove();
}

// ----------------------------------------------------- Storage ------------------------------------------------------------------

function addToLocalStorage(storageArray) {
  const myArrayStringfied = JSON.stringify(storageArray);
  localStorage.setItem('itens', myArrayStringfied);
}

function refreshLocalStorage(element) {
  localStorage.removeItem(localStorage.key('itens'));
  addToLocalStorage(element);
}

// ------------------------------------------------------ Cart Price --------------------------------------------------------------

function prices(array) {
  let value = 0;
  console.log('Array');
  console.log(array);
  value = array.map((object) => object.salePrice).reduce((acc, curr) => acc + curr, 0);
  return value;
}

function creatElementP() {
  const p = document.createElement('p');
  p.classList = 'cart_price';
  p.innerHTML = 'Preço total: $<span class = "total-price">0</span>';
  const cart = document.querySelector('.cart');
  cart.appendChild(p);
}

function returnFixed(htmlItem, currentPrice, stringCurrentPrice) {
  const span = htmlItem;
  if (stringCurrentPrice[stringCurrentPrice.length - 1] === '0') {
    span.innerText = `${currentPrice.toFixed(1)}`;
  } else {
    span.innerText = `${currentPrice.toFixed(2)}`;
  }
}

function refreshShoppingCartPrice(array) {
  const span = document.querySelector('.total-price');
  const currentPrice = prices(array);
  const stringCurrentPrice = currentPrice.toFixed(2).toString();
  if (currentPrice > currentPrice.toFixed() || currentPrice < currentPrice.toFixed()) {
    returnFixed(span, currentPrice, stringCurrentPrice);
  } else {
    span.innerText = `${currentPrice.toFixed()}`;
  }
}

// ------------------------------------------------------- Base -------------------------------------------------------------------

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
  const click = event.target;
  const clickContent = click.innerHTML;
  myArray.map((object) => object.sku).forEach((id, index) => {
    if (clickContent.includes(id)) {
      myArray.splice(index, 1);
      return myArray;
    }
  });
  click.remove();
  refreshLocalStorage(myArray);
  refreshShoppingCartPrice(myArray);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ------------------------------------------------------ Cart --------------------------------------------------------------------

function fetchItems(items) {
  return fetch(`https://api.mercadolibre.com/items/${items}`)
    .then((response) => response.json())
    .then((result) => {
      const myObj = {
        sku: result.id,
        name: result.title,
        salePrice: result.price,
      };
      const itemCart = createCartItemElement(myObj);
      const cartList = document.querySelector(cartItems);
      myArray.push(myObj);
      cartList.appendChild(itemCart);
      addToLocalStorage(myArray);
    });
}

async function addItemToShoppingCart(sku) {
  await fetchItems(sku);
  refreshShoppingCartPrice(myArray);
}

// ------------------------------------------------------ Buttons -----------------------------------------------------------------

function getButtons(element) {
  const addButtons = element.querySelector('.item__add');
  const sku = getSkuFromProductItem(element);
  addButtons.addEventListener('click', () => addItemToShoppingCart(sku));
}

function cleanCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    localStorage.clear();
    const listEraser = document.querySelector(cartItems);
    listEraser.innerHTML = '';
    myArray = [];
    refreshShoppingCartPrice(myArray);
  });
}

// ---------------------------------------------------- Product List --------------------------------------------------------------

function fetchApi(url) {
  loading();
  return fetch(url)
    .then((response) => response.json())
    .then((respo) => respo.results);
}

async function productsList() {
  const itensSection = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetchApi(url)
    .then((results) => {
      results.forEach((element) => {
        const product = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        itensSection.appendChild(product);
        getButtons(product);
      });
    });
  getOutLoading();
}

async function getAll() {
  const element = localStorage.getItem('itens');
  const elementArray = JSON.parse(element);
  const ol = document.querySelector(cartItems);

  for (let index = 0; index < elementArray.length; index += 1) {
    const el = elementArray[index];
    const li = createCartItemElement(el);
    myArray.push(el);
    ol.appendChild(li);
  }
  refreshShoppingCartPrice(myArray);
}

window.onload = function onload() {
  loading();
  getOutLoading();
  productsList();
  creatElementP();
  getAll();
  cleanCart();
};
