const cartItems = () => document.querySelector('.cart__items');

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

async function sumPrices() {
  const listOfCar = await document.querySelectorAll('li');
  const p = document.querySelector('p');
  let sum = 0;
  for (let index = 0; index < listOfCar.length; index += 1) {
    sum += parseFloat(listOfCar[index].innerText.split('$')[1]);
  }
  p.innerText = `${sum}`;
}

function eventSaveList() {
  const getInnerHTML = {
    list: cartItems().innerHTML,
  };
  const getInnerHTMLJSON = JSON.stringify(getInnerHTML);
  localStorage.setItem('listaCompleta', getInnerHTMLJSON);
  // emptyingCar();
  return JSON.parse(localStorage.getItem('listaCompleta'));
}

async function emptyingCar() {
  const currentlyList = cartItems();
  const buttonEmpt = document.querySelector('.empty-cart');
  buttonEmpt.addEventListener('click', () => {
    currentlyList.innerText = '';
    sumPrices();
    eventSaveList();
  });
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const li = event.target;
  const ol = li.parentNode;
  ol.removeChild(li);
  eventSaveList();
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function clickButtons(callback) {
  const arrayButtons = document.querySelectorAll('.item__add');
  arrayButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const computer = callback[index]; 
      fetch(`https://api.mercadolibre.com/items/${computer.id}`)
        .then((resp) => resp.json())
          .then((r) => {
            const objItem = { sku: r.id, name: r.title, salePrice: r.price }; 
            cartItems().appendChild(createCartItemElement(objItem));
            eventSaveList();
            sumPrices();
          });
    });
  });
}

//  Requisito 1

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function fetchProducts() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
      .then((r) => r);
}

async function getProducts() {
  const items = document.querySelector('.items');
  const produtos = await fetchProducts()
    .then((resp) => resp.results);
    produtos.forEach((computador) => {
      const objItem = {
        sku: computador.id,
        name: computador.title,
        image: computador.thumbnail,
      };
      const item = createProductItemElement(objItem);
      items.appendChild(item);
    });
    clickButtons(produtos);
  }

/*

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
function defineVariable() {
  if (localStorage.getItem('listaCompleta') != null) {
   const listaLocalStoryString = JSON.parse(localStorage.getItem('listaCompleta'));
   const ol = document.querySelector('.cart__items');
   ol.innerHTML = listaLocalStoryString.list;
   const items = document.querySelectorAll('.cart__item');
   items.forEach((item) => {
     item.addEventListener('click', (event) => {
       cartItemClickListener(event);
     });
   });
  }
}

window.onload = function onload() { 
   cartItems();
   getProducts();
   clickButtons();
   defineVariable();
   sumPrices();
   emptyingCar();
};
