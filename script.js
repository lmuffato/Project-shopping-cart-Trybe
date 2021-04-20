const cartItems = '.cart__items';

const arrayPrices = [];

const totalPrices = '.total-price';
// referência: Gildeir, me ajudou na reformulação do localStorage
function gettingItems() {
  const getItems = localStorage.getItem('selectedItems');
  document.querySelector(cartItems).innerHTML = getItems;
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

// referência - Bruno, ajudou em toda a lógica de como remover o preço do produto após a retirada do carrinho.
function cartItemClickListener(event) {
  const { target } = event;
  const getTotalPrice = document.querySelector(totalPrices);
  const obj = target.parentNode.children;
  const rest = [...obj];
  rest.forEach((value, index) => {
    if (target === value) {
      target.parentNode.removeChild(target);
      arrayPrices.splice(index, 1);
      const reduceSum = arrayPrices.reduce((acc, totalValue) => acc + totalValue, 0);
      getTotalPrice.textContent = reduceSum;
    }
  });
  localStorage.removeItem('selectedItems');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector('ol.cart__items').appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// funções de fetch, 1 e 2 requisito

const createCartItem = async (item) => {
  const getProduct = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const response = await getProduct.json();
  // savingItems();
  return response;
};

// Bruno ajudou na fundamentação da lógica para o cálculo do preço.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async () => {
    const gettingChild = section.firstChild.innerHTML;
    const returnFunction = await createCartItem(gettingChild);
    document.querySelector(cartItems).appendChild(createCartItemElement(returnFunction));
    arrayPrices.push(returnFunction.price);
    const reducePrices = arrayPrices.reduce((acc, totalValue) => acc + totalValue);
    const getTotalPrice = document.querySelector(totalPrices);
    getTotalPrice.textContent = reducePrices;
    const cartLi = document.querySelector(cartItems);
    localStorage.setItem('selectedItems', cartLi.innerHTML);
  });
  return section;
}
// ajuda de Bruno, turma 10 na nossa chamada da madrugada.
async function fetchProducts() {
  const createLoad = document.createElement('section');
  createLoad.classList.add('loading');
  createLoad.innerText = 'Levando as compras ao caixa';
  const getItems = document.querySelector('.items');
  getItems.appendChild(createLoad);
  const getProduct = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const result = await getProduct.json();
    const data = await result.results;
    data.forEach((value) => {
      const product = { sku: value.id, name: value.title, image: value.thumbnail };
      document.querySelector('.items').appendChild(createProductItemElement(product));
  });
  createLoad.remove();
}

// referência Patrick e Rogério - turma 10. Me deu noção e lógica de como fazer o botão de maneira pragmática e funcional.
const clearingCart = () => {
  const getCart = document.querySelector('.empty-cart');
  getCart.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = '0.00';
    localStorage.removeItem('selectedItems');
  });
};
window.onload = function onload() {
 clearingCart();
 fetchProducts();
 gettingItems();
};
