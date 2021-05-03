let totalPrice = 0;

const addPrice = async (price) => {
  totalPrice += price;
  return totalPrice;
};

const substractPrice = async (price) => {
  totalPrice -= price;
  return totalPrice;
};

const displaysTotalPrice = async (action, price) => {
  const textPrice = document.querySelector('.total-price');
  textPrice.innerText = await action(price);
};

const storeItens = () => {
  const arrayElements = [];
  const elementsOfCart = document.querySelectorAll('.cart__item');
  elementsOfCart.forEach((element) => arrayElements.push(element.outerHTML));
  localStorage.setItem('listOfElements', arrayElements);
};

const removeTextLoad = () => {
  document.querySelector('.loading').remove();
};

const clearAll = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerText = '';
  displaysTotalPrice(substractPrice, totalPrice);
  storeItens();
};

const getAllComputers = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const list = await response.json();
  removeTextLoad();
  return list;
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

/* function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  const itemOfCart = event.target;
  const value = Number(event.target.innerHTML.split('PRICE: $')[1]);
  itemOfCart.remove();
  displaysTotalPrice(substractPrice, value);
  storeItens();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const requisition = async (e) => {
  const IdItem = e.target.parentNode.firstChild.innerText;
  const response = await fetch(`https://api.mercadolibre.com/items/${IdItem}`);
  const objItem = await response.json();
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(objItem));
  displaysTotalPrice(addPrice, objItem.price);
  storeItens();
};

const createListeners = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', requisition);
  });
};

const addClickEvent = () => {
  const savedList = document.querySelectorAll('.cart__item');
  savedList.forEach((element) => element.addEventListener('click', cartItemClickListener));
};

const renderItems = () => {
  if (localStorage.getItem('listOfElements')) {
    const elementsOfCart = document.querySelector('ol');
    const savedList = localStorage.getItem('listOfElements').split(',');
    savedList.forEach((element) => {
      elementsOfCart.innerHTML += element;
    });
    addClickEvent();
  }
};

window.onload = async function onload() {
  const computers = await getAllComputers();
  const sectionSelected = document.querySelector('.items');
  computers.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    sectionSelected.appendChild(createProductItemElement({ sku, name, image }));
  });
  createListeners();
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', clearAll);
  renderItems();
};
