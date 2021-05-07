const fetchAPI = () => { // requisito 1
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return new Promise((resolve) => {
    fetch(endpoint)
    .then((response) => {
      response.json().then((computers) => {
          resolve(computers.results);
        });
      });
  });
};

const fetchItem = (idItem) => { // requisito 2
  const endpointItem = `https://api.mercadolibre.com/items/${idItem}`;
  return new Promise((resolve) => {
    fetch(endpointItem)
      .then((response) => {
        response.json().then((item) => {
          resolve(item);
        });
      });
  });
};
  
function createProductImageElement(imageSource) { // requisito 1
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // requisito 1
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) { // requisito 2
  return item.querySelector('span.item__sku').innerText;
}

// Ajuda de Sérgio Martins - Turma 10 - Tribo A
const saveItens = () => { // requisito 4
  const itemCart = document.querySelectorAll('.cart__item');
  const newArr = [];
  itemCart.forEach((element) => newArr.push(element.outerHTML));
  localStorage.setItem('itensList', newArr);
};

// Feito com ajuda de Lucas Pedroso - turma 10 - Tribo A
const sumPrices = () => {
  const areaPrice = document.querySelectorAll('.price');
  const precoTotal = [...areaPrice].reduce((acc, actual) => 
  acc + parseFloat(parseFloat(actual.innerText).toFixed(2)), 0);
  document.querySelector('.total-price').innerText = precoTotal;
};

const cartItemClickListener = (event) => { // requisito 3
  let eventListItem = event.target;
  console.log(eventListItem.tagName);
  
  if (eventListItem.tagName === 'SPAN') eventListItem = eventListItem.parentNode;

  eventListItem.remove();
  saveItens(); // requisito 4
  sumPrices();
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => { // requisito 2
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class="price">${salePrice}</span>`;
  li.addEventListener('click', cartItemClickListener); // requisito 3
  return li;
};

// Ajuda de Eduardo Costa e Douglas Santana (Ambos Turma 10 - Tribo A)
const addItem = () => { // requisito 2
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', async (event) => {
    const addEvent = event.target;
    const skulId = getSkuFromProductItem(addEvent.parentElement);
    const data = await fetchItem(skulId);
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.appendChild(createCartItemElement(data));
    saveItens(); // requisito 4
    sumPrices(); // requisito
  }));
};

const clearButton = () => { // requisito 6
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.innerHTML = '';
    saveItens(); // requisito 4
    sumPrices();
  });
};

// Ajuda de Sérgio Martins - Turma 10 - Tribo A
const addEventClickCart = () => { // requisito 4
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((elemento) => {
    elemento.addEventListener('click', cartItemClickListener);
  });
};

const getItens = () => { // requisito 4
  if (localStorage.getItem('itensList')) {
    const itemsCart = document.querySelector('ol');
    const arrayStorage = localStorage.getItem('itensList').split(',');
    arrayStorage.forEach((elemento) => {
      itemsCart.innerHTML += elemento;
    });
    addEventClickCart();
  }
};

// Ajuda de Murilo Gonçalves - Turma 10 - Tribo A
const msgLoading = () => { // requisito 7
  const loading = document.querySelector('.loading');
  loading.remove();
};

const createProductItemElement = async () => { // requisito 1
  const computers = await fetchAPI();
  msgLoading(); // requisito 7

  computers.forEach(({ id, title, thumbnail }) => {
    const section = document.createElement('section');
    const sectionItems = document.querySelector('.items');
    section.className = 'item';
  
    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    sectionItems.appendChild(section);
  });
  addItem(); // requisito 2
  clearButton(); // requisito 6
};

window.onload = function onload() {
  fetchAPI(); // requisito 1
  createProductItemElement(); // requisito 1
  getItens(); // requisito 4
};