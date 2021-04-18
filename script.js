let arrayItems = JSON.parse(localStorage.getItem('li')) || [];
let totalPrice = JSON.parse(localStorage.getItem('price')) || 0;
const cartItem = '.cart__items';
const totalPriceID = '.total-price';
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
  document.querySelector('.items').appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
function totalPriceFunction(price) {
  totalPrice += parseFloat(price.toFixed(2));
  localStorage.setItem('price', JSON.stringify(parseFloat(totalPrice.toFixed(2))));
  if (document.getElementsByClassName('tp').length === 0) {
    const ol = document.createElement('ol');
    ol.className = 'total-price';
    const li = document.createElement('li');
    li.className = 'tp';
    li.innerText = `${parseFloat(totalPrice.toFixed(2))}`;
    document.querySelector('.cart').appendChild(ol);
    document.querySelector(totalPriceID).appendChild(li);
  } else {
    const child = document.querySelector('.tp');
    child.remove();
    const li = document.createElement('li');
    li.className = 'tp';
    li.innerText = `${parseFloat(totalPrice.toFixed(2))}`;  
    document.querySelector(totalPriceID).appendChild(li);
  }
  }
 function cartItemClickListener(event) {
  event.target.remove();
  const priceArray = event.target.innerHTML.split('$');
  const price = parseFloat(priceArray[1], 10);
  totalPriceFunction(-parseFloat(price.toFixed(2)));
  const itemsObj = document.querySelectorAll('.cart__item');
  const items = [...itemsObj];
  arrayItems = [];
  items.forEach((item) => arrayItems.push(item.innerHTML));
  localStorage.setItem('li', JSON.stringify(arrayItems));
} 
function btnEmptyCart() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    const items = document.querySelectorAll('.cart__item');
    items.forEach((item) => item.remove());
    localStorage.clear();
    totalPrice = 0;
    totalPriceFunction(0);
  });
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  arrayItems.push(li.textContent);
  localStorage.setItem('li', JSON.stringify(arrayItems));
  localStorage.setItem('price', JSON.stringify(price));
  totalPriceFunction(price);
  document.querySelector(cartItem).appendChild(li);
   li.addEventListener('click', cartItemClickListener);
  return li;
}
function fetchCartItem() {
  const btns = document.querySelectorAll('.item__add');
  if (btns.length > 0) {
    btns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
       const itemSection = event.target.parentNode;
       const itemChildren = itemSection.children;
        const searchId = [...itemChildren];
       const idElement = searchId.find((element) => element.className === 'item__sku');
       const id = idElement.textContent;
       fetch(`https://api.mercadolibre.com/items/${id}`)
       .then((response) => {
        response.json().then((product) => {
          createCartItemElement(product);
        });
       });
      });
    });
  }
} 

function fetchItem() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') 
    .then((response) => {
      response.json().then((data) => {
        data.results.forEach((result) => {
          createProductItemElement(result);
        });
        fetchCartItem();
      });
    });
}
function storageList() {  
  arrayItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = item;
    document.querySelector(cartItem).appendChild(li);
    li.addEventListener('click', cartItemClickListener);
  });
}

 /* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
window.onload = function onload() { 
  fetchItem();
  storageList();
  totalPriceFunction(0);
  btnEmptyCart();
};