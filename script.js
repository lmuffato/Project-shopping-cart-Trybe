// Requisitos realizados com ajuda do Zezé, Adelino, Orlando Flores, Thiago Souza, Lucas Lara, Nathi, Nilson, Tiago Santos
const cartList = document.querySelector('.cart__items');
const cartListItems = '.cart__item';
const priceDiv = document.createElement('div');
priceDiv.className = 'total-price';
const cart = document.querySelector('#total');
cart.appendChild(priceDiv);

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function saveCart() {
  const cartListElements = [...document.querySelectorAll(cartListItems)];
  cartListElements.forEach((item, index) => {
    localStorage.setItem(`cartItem${index}`, item.textContent);
  });
}

function sumPrice() {
  const cartElements = cartList.childNodes;
  if (cartElements.length === 0) {
    return '---';
  }
  const productArray = [];
  for (let index = 0; index < cartElements.length; index += 1) {
    const { innerText } = cartElements[index];
    const value = innerText.substring(innerText.indexOf('$') + 1);
    productArray.push(parseFloat(value));
  }
  const totalPrice = parseFloat((productArray.reduce((acc, curr) => acc + curr, 0)).toFixed(2));
  return totalPrice;
}

function showPrice() {
  priceDiv.innerText = sumPrice();
}

function cartItemClickListener(event) {
  const selectedLi = event.target;
  selectedLi.parentElement.removeChild(selectedLi);
  localStorage.clear();
  saveCart();
  showPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function clearCart() {
  localStorage.clear();
  while (cartList.firstChild) {
    cartList.removeChild(cartList.lastChild);
  }
  showPrice();
}

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', clearCart);

function recoverCart() {
  const localStorageItems = localStorage.length;
  for (let index = 0; index < localStorageItems; index += 1) {
    const text = localStorage.getItem(`cartItem${index}`);
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = text;
    li.addEventListener('click', cartItemClickListener);
    cartList.appendChild(li);
  }
}

async function getSpecificProduct(productId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const data = await response.json();
  const prodData = data;
  const productList = { sku: prodData.id, name: prodData.title, salePrice: prodData.price };
  cartList.appendChild(createCartItemElement(productList));
  saveCart();
  showPrice();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getItemData() {
  const buttonAddToChart = [...document.querySelectorAll('.item__add')];
  buttonAddToChart.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = getSkuFromProductItem(event.target.parentElement);
      getSpecificProduct(productId);
    });
  });
}

function createProductsList(computerData) {
  let computers = {};
  const computerSection = document.querySelector('.items');
  computerData.forEach((computer) => {
    computers = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    computerSection.appendChild(createProductItemElement(computers));
  });
  getItemData();
}

async function getComputers() {
  const loader = document.createElement('div');
  loader.className = 'loading';
  loader.innerText = 'Loading...';
  const container = document.querySelector('.items');
  container.appendChild(loader);
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  if (data !== undefined) {
    container.removeChild(loader);
    const computerData = data.results;
    createProductsList(computerData);
  }
}

window.onload = function onload() {
  getComputers();
  getItemData();
  recoverCart();
  showPrice();
};
