const cartItems = '.cart__items';

const saveCart = () => {
  const cartList = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('cartList', cartList);
};

async function calcTotal() {
  const liCart = document.getElementsByTagName('li');
  let soma = 0;
  for (let index = 0; index < liCart.length; index += 1) {
    const price = parseFloat(liCart[index].innerText.split('$')[1], 10);
    soma += price;
  }
  let total = document.querySelector('.total-price');
  if (total !== null) document.querySelector(cartItems).removeChild(total);
  if (soma > 0) {
    total = document.createElement('p');
    total.innerText = `Preço total: $${soma}`;
    total.className = 'total-price';
    document.querySelector(cartItems).appendChild(total); 
  }  
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveCart();
  calcTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function callCreateCartItem(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((result) => result.json());
  const cartObject = { sku, name: product.title, salePrice: product.price };
  const itemCart = createCartItemElement(cartObject);
  document.querySelector('ol.cart__items').appendChild(itemCart);
  saveCart();
  calcTotal();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', callCreateCartItem);
  section.appendChild(button);  
  return section;
}
async function loadProducts() {
  const recoveryData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((result) => result.results);
  recoveryData.forEach((computer) => {
    const computerObject = { sku: computer.id, name: computer.title, image: computer.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(computerObject));
  });
}

window.onload = function onload() { 
  const buttonEmpty = document.querySelector('.empty-cart');
  const listCart = document.querySelector('.cart__items');
  const listContent = localStorage.getItem('cartList');
  buttonEmpty.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    saveCart();
  });
  if (listContent !== null) listCart.innerHTML = listContent;
  const liCart = document.getElementsByTagName('li');
  for (let index = 0; index < liCart.length; index += 1) {
    liCart[index].addEventListener('click', cartItemClickListener);
  }
  calcTotal();
  loadProducts();
};
