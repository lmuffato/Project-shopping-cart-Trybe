// Variaveis Globais

let sum = localStorage.getItem('keySoma');

// ------------------------------ Já veio pronto: 

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

// Desafio 5 - Somando os valores do Carrinho:

const sumPrices = async () => {
  const ul = document.querySelector('.total-price');
  ul.innerHTML = sum; // depois testar com toFixed 
};

// ------------------------------ Já veio pronto: 

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Desafio 3 - Removendo do Carrinho

function cartItemClickListener(event) {
  const getItemsFromCart = document.querySelector('.cart__items');
  getItemsFromCart.removeChild(event.target);
}

// ------------------------------ Já veio pronto: 
const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

// Desafio 2 - Adicionando no Carrinho

const addToCart = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement); // Retirei a ideia de pegar o target pai do Miguel Dantas sala 09 
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const data = await response.json();

  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };

  document.querySelector('ol.cart__items').appendChild(createCartItemElement(obj));
  localStorage.setItem(itemID, JSON.stringify(obj));

  sum += obj.salePrice;
  await sumPrices();
  localStorage.setItem('keySoma', sum);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const bt = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  bt.addEventListener('click', addToCart);
  section.appendChild(bt);
  return section;
}

// Desafio 7 - Loading!!!  
// Inspirado pelo aluno Miguel Dantas SdA 09

const removeLoading = () => {
  const getLoadingParent = document.getElementById('loadingParent');
  getLoadingParent.remove();
};

// Desafio 1 - Realizando a consulta na API

const getResults = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  console.log(response);
  const data = await response.json();
  removeLoading();
  data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const objPc = {
      sku,
      name,
      image,
    };
    const getSection = document.querySelector('.items');
    getSection.appendChild(createProductItemElement(objPc));
  });
};

// Carregando o Carrinho de Compras ao Entrar no Site

const loadCart = () => {
  const getSpace = document.querySelector('ol.cart__items');
  Object.keys(localStorage).forEach((item) => {
    if (item !== 'keySoma') {
      getSpace.appendChild(createCartItemElement(JSON.parse(localStorage[item])));
    }
  });
};

// Desafio 6 - Limpar TODO o Carrinho de Compras

const removeAllItems = () => {
  const bt = document.querySelector('.empty-cart');
  bt.addEventListener('click', () => {
    localStorage.clear();
    sum = 0;
    sumPrices();

    const getItemsFromCart = document.querySelector('.cart__items');
    while (getItemsFromCart.firstChild) {
      getItemsFromCart.removeChild(getItemsFromCart.firstChild);
    }
  });
};

removeAllItems();

window.onload = function onload() {
  getResults();
  loadCart();
  sumPrices();
};