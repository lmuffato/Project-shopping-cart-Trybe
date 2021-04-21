const itemAisle = document.getElementsByClassName('items');
const cartitems = document.getElementsByClassName('cart__items');
const cart = document.getElementsByClassName('cart');
const grandTotal = document.getElementsByClassName('total-price');
const allselecteditems = document.getElementsByClassName('cart__item');

const valueHolder = (value) => {
  const placeHolder = document.createElement('div');
  placeHolder.innerHTML = value;
  placeHolder.className = 'total-price';
  if (grandTotal.length === 0) { 
  cart[0].appendChild(placeHolder);
  }
  cart[0].removeChild(cart[0].lastChild);
  cart[0].appendChild(placeHolder);
};

async function sumPrices() {
  let totalvalue = 0;
  const allElements = cartitems[0].children;
  for (let index = 0; index < allElements.length; index += 1) {
    const info = Object.values(allElements[index].innerHTML.split(' '));
    const valuable = info[info.length - 1].slice(1);
    totalvalue += parseFloat(valuable);
  }
  valueHolder(totalvalue);
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

function storageUnit() {
  const saveInfo = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_info', saveInfo);
}

function cartItemClickListener(event) {
  for (let index = 0; index < allselecteditems.length; index += 1) {
    if (allselecteditems[index] === event.target) {
    allselecteditems[index].remove(event.target); 
    }
  }
  storageUnit();
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
  }

async function itemSelector(event) {
  const specHTML = await fetch(`https://api.mercadolibre.com/items/${event}`);
  const productInfo = await specHTML.json();
  const { title, price } = productInfo;
  const infoExport = {
    sku: event,
    name: title,
    salePrice: price,
  };
  cartitems[0].appendChild(createCartItemElement(infoExport));
  storageUnit();
  sumPrices();
}

function getSkuFromProductItem(item) {
  const product = item.target.parentElement;
  const id = product.querySelector('span.item__sku').innerText;
  itemSelector(id);
}
  
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);
  button.addEventListener('click', getSkuFromProductItem);
  return section;
}
  
async function getInfo() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const info = await response.json();
  const { results } = info;
  results.forEach((item) => {
    const infoExport = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
  itemAisle[0].appendChild(createProductItemElement(infoExport));
  });
}

const savedInfo = () => {
  const saved = localStorage.getItem('cart_info');
  cartitems[0].insertAdjacentHTML('afterbegin', saved);
  cartitems[0].addEventListener('click', cartItemClickListener);
};

window.onload = function onload() {
  getInfo();
  savedInfo();
  sumPrices();
};
