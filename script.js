const classCartItems = '.cart__items';

// const uptadeCart = () => {
//   const cartList = document.querySelector(classCartItems).innerHTML;
//   localStorage.setItem('cartList', cartList);
// };

const uptadeCart = () => {
  localStorage.setItem('cart', document.querySelector(classCartItems).innerHTML);
  localStorage.setItem('total price', document.querySelector('.total-price').innerHTML);
};

async function totalPrice() {
  const allItems = document.getElementsByTagName('li');
  let sum = 0;
  for (let index = 0; index < allItems.length; index += 1) {
    const price = parseFloat(allItems[index].innerText.split('$')[1], 10);
    sum += price;
  }
  let total = document.querySelector('.start-sum');
  if (total !== null) total.parentElement.removeChild(total);
  if (sum > 0) {
    const startSum = document.createElement('p');
    startSum.innerText = 'Preço total: $ ';
    startSum.className = 'start-sum';
    total = document.createElement('span');
    total.innerText = sum;
    total.className = 'total-price';
    startSum.appendChild(total);
    document.querySelector('.cart').appendChild(startSum); 
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
  uptadeCart();
  totalPrice();
}

const loadLocalStorage = () => {
  document.querySelector('.total-price').innerHTML = localStorage.getItem('total price');
  document.querySelector(classCartItems).innerHTML = localStorage.getItem('cart items');
  document
    .querySelectorAll('.cart__item')
    .forEach((e) => e.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function createCartItem(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((result) => result.json());
  const cartObject = { sku, name: product.title, salePrice: product.price };
  const itemCart = createCartItemElement(cartObject);
  document.querySelector('ol.cart__items').appendChild(itemCart);
  uptadeCart();
  totalPrice();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', createCartItem);
  section.appendChild(button);  
  return section;
}

async function loadProducts() {
  const loadText = document.createElement('section');
  loadText.innerText = 'Aguarde o carregamento dos produtos';
  loadText.className = 'loading';
  document.querySelector('.items').appendChild(loadText);
  const recoveryData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((result) => result.results);
  loadText.parentElement.removeChild(loadText);
  recoveryData.forEach((computer) => {
    const computerObject = { sku: computer.id, name: computer.title, image: computer.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(computerObject));
  });
}

// const emptyCartList = () => {
//   document.querySelector('ol.cart__items').innerHTML = '';
//   totalPrice();
//   uptadeCart();
// };

window.onload = function onload() { 
  // document.querySelector('.empty-cart').addEventListener('click', emptyCartList);
  const listCart = document.querySelector('.cart__items');
  const listContent = localStorage.getItem('cartList');
  if (listContent !== null) listCart.innerHTML = listContent;
  const liCart = document.getElementsByTagName('li');
  for (let index = 0; index < liCart.length; index += 1) {
    liCart[index].addEventListener('click', cartItemClickListener);
  }
  totalPrice();
  loadProducts();
  loadLocalStorage();
};
