const cart = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function searchAPI() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => { 
        response.json()
        .then((data) => { resolve(data.results); });
      });
  });
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

  document.querySelector('.items').appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

 function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (e) => cartItemClickListener(e));
  return li;
 }

function searchApiId(id) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => { 
      response.json()
      .then((data) => resolve(data));
    });
  });
}

function foundSectionId(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function saveCartItems() {
  const cartList = [...document.querySelectorAll('.cart__item')];
  cartList.forEach((item, index) => {
    localStorage.setItem(`cartItem${index}`, item.textContent);
  });
}

function recoverCart() {
  const localStorageItems = localStorage.length;
  for (let index = 0; index < localStorageItems; index += 1) {
    const text = localStorage.getItem(`cartItem${index}`);
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = text;
    li.addEventListener('click', cartItemClickListener);
    cart.appendChild(li);
  }
}

function addListener(element) {
   const lista = document.querySelector('.cart__items');
   element.addEventListener('click', async (e) => {
    const itemId = foundSectionId(e.target.parentNode);
    const foundAPI = await searchApiId(itemId);
    const obj = { sku: foundAPI.id, name: foundAPI.title, salePrice: foundAPI.price };
    lista.appendChild(createCartItemElement(obj));
    saveCartItems();
   });
}

async function makeObjsAndTakeButtons() {
  searchAPI().then((response) => {
       Array.from(response).forEach(({ id, title, thumbnail }) => {
        createProductItemElement({ sku: id, name: title, image: thumbnail });
       });
   }).then(() => {
    const icones = document.querySelectorAll('.item__add');
    icones.forEach((element) => {
      addListener(element);
    });
  });
}

function clearCart() {
  localStorage.clear();
  while (cart.firstChild) {
    cart.removeChild(cart.lastChild);
  }
}

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', clearCart);

window.onload = function onload() {
  makeObjsAndTakeButtons();
  recoverCart();
};