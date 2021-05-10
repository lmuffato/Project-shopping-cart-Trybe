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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function sumValue() {
  let sum = 0;
  const totalValue = document.getElementsByClassName('total-price');
  const cartItems = document.querySelectorAll('li');
  [...cartItems].forEach((element) => {
    sum += parseFloat(element.innerHTML.split('$')[1]);
    
    totalValue.innerHTML = sum;
  });
}

function saveCart() {
  const cartList = document.getElementsByClassName('cart__items');
  const totalValue = document.querySelector('.total-price');
  localStorage.setItem('cart', cartList.innerHTML);
  
  localStorage.setItem('value', totalValue.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  
  sumValue();
  saveCart();
}

function loadCart() {
  const cartList = document.getElementsByClassName('cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  
  const cartItems = document.querySelectorAll('li');
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  
  sumValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyCart() {
  const emptyCartBtn = document.querySelector('.empty-cart');
  const cartList = document.querySelector('.cart__items');
  const totalValue = document.querySelector('.total-price');
  emptyCartBtn.addEventListener('click', () => {
    cartList.innerHTML = '';
    localStorage.clearAll();
    totalValue.innerHTML = 0;
  });
}

function loadingAlert() {
  const loading = document.createElement('p');
  
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  
  document.body.appendChild(loading);
}

function removeLoadingAlert() {
  const loading = document.querySelector('.loading');
  document.body.removeChild(loading);
}

async function fetchAPIML(QUERY) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  loadingAlert();
  
  const response = await fetch(endpoint);
  const object = await response.json();
  const { results } = object;
  const itemsElement = document.querySelector('.items');
  
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  removeLoadingAlert();
}

async function fetchID(sku) {
    loadingAlert();
  
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((data) => {
      const dataProduct = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      
      const list = document.querySelector('.cart__items');
      
      list.appendChild(createCartItemElement(dataProduct));
    });
  removeLoadingAlert();
  sumValue();
  saveCart();
}

function getId() {
  const sectionItems = document.querySelector('.items');
  
  sectionItems.addEventListener('click', (event) => {
    const item = event.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    
    fetchID(sku);
  });
}

window.onload = function onload() {
  fetchAPIML('computador');
  getId();
  loadCart();
  emptyCart();
};
