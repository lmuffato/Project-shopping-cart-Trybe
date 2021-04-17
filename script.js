const cartItemsClass = '.cart__items';

const saveCartItems = () => {
  const cart = document.querySelector(cartItemsClass).innerHTML;
  localStorage.setItem('cart', cart);
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

async function calcTotal() {
  const lis = document.querySelectorAll('li');
  let sum = 0;
  lis.forEach((li) => {
    const price = parseFloat(li.innerText.split('$')[1], 10);
    sum += price;
  });
  let totalPrice = document.querySelector('.total-label');
  if (totalPrice !== null) totalPrice.parentElement.removeChild(totalPrice);
  if (sum > 0) {
    const totalLabel = document.createElement('span');
    totalLabel.innerText = 'Preço total: R$';
    totalLabel.className = 'total-label';
    totalPrice = document.createElement('span');
    totalPrice.innerText = sum;
    totalPrice.className = 'total-price';
    totalLabel.appendChild(totalPrice);
    document.querySelector('.cart').appendChild(totalLabel); 
  }  
}

async function getItems() { 
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const object = await response.json();
  const { results } = object;
  const itemsElement = document.querySelector('.items');

  results.forEach((result) => {
    const resultItem = {
      sku: result.id, 
      name: result.title,
      image: result.thumbnail,
    };
    itemsElement.appendChild(createProductItemElement(resultItem));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveCartItems();
  calcTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItem(e) {
  const productId = getSkuFromProductItem(e.target.parentNode);
  const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const object = await response.json();
  const cartItems = document.querySelector(cartItemsClass);
  cartItems.appendChild(createCartItemElement(object));
  saveCartItems();
  calcTotal();
}

const emptyButton = () => {
  document.querySelector('ol.cart__items').innerHTML = '';
  saveCartItems();
  calcTotal();
};
window.onload = function onload() {
  document.querySelector('.empty-cart').addEventListener('click', emptyButton);
  const listCart = document.querySelector(cartItemsClass);
  const listContent = localStorage.getItem('cart');
  if (listContent !== null) listCart.innerHTML = listContent;
  const lisCart = document.querySelectorAll('li');
  lisCart.forEach((li) => li.addEventListener('click', cartItemClickListener));
  getItems()
  .then(() => {
    const buttons = document.querySelectorAll('.item__add');
    buttons.forEach((button) => button.addEventListener('click', getItem));
  });
  calcTotal();
};
