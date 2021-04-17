// Requisitos realizados com ajuda do Zezé, Adelino, Orlando Flores, Thiago Souza, Lucas Lara, Nathi, Nilson, Tiago Santos

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

 function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getSpecificProduct(productId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const data = await response.json();
  const prodData = data;
  const productList = { sku: prodData.id, name: prodData.title, salePrice: prodData.price };
  console.log(productList);
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement(productList));
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
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const computerData = data.results;
  createProductsList(computerData);
}

// function cartItemClickListener() {
  
// }

window.onload = function onload() {
  getComputers();
  getItemData();
};
