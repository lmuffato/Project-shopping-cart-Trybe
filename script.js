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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function selectItem() {
  return document.querySelector('.cart__items');
}

function saveCart() {
  const cartList = selectItem();
  localStorage.setItem('cart', cartList.innerHTML);
}

function emptyChart() {
  const btnEmpty = document.querySelector('.empty-cart');
  const itemsChart = document.querySelectorAll('.cart__item');
  btnEmpty.addEventListener('click', () => {
    itemsChart.forEach((item) => item.remove());  
  });
}

function loadCart() {
  const cartList = selectItem();
  cartList.innerHTML = localStorage.getItem('cart');
  const cartItems = document.getElementsByClassName('cart__item');
  [...cartItems].forEach((item) => item.addEventListener('click', cartItemClickListener));
}

async function workId(btn) {
  const myId = getSkuFromProductItem(btn.parentNode);
  const itemSelectedRaw = await fetch(`https://api.mercadolibre.com/items/${myId}`);
  const itemSelected = await itemSelectedRaw.json();
  const containerSide = selectItem();

  btn.addEventListener('click', () => {
    const addItemSide = {
      sku: itemSelected.id,
      name: itemSelected.title,
      salePrice: itemSelected.price,
    };
    const item = createCartItemElement(addItemSide);
    containerSide.appendChild(item);
    saveCart();
    emptyChart();
  });
}

const buttonListener = () => {
  const btns = document.querySelectorAll('.item__add');
  btns.forEach(workId);
};

function loadingSplash() {
  const loading = document.createElement('h1');
  loading.className = 'loading';
  loading.innerText = 'Carregando...';
  document.body.appendChild(loading);
}

function removeLoadingSplash() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

const getItem = async () => {
  loadingSplash();
  const rawData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const obj = await rawData.json();
  const arrayResults = obj.results;
  const items = document.querySelector('.items');

  arrayResults.forEach((element) => {
    const mainTiles = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    
    const item = createProductItemElement(mainTiles);
    items.appendChild(item);
  });
  removeLoadingSplash();
  buttonListener();
};

window.onload = function onload() {
  getItem();
  loadCart();
  emptyChart();
};
