// Jogar os itens que vão pro localStorage dentro de uma lista e depois recuperar os objetos de dentro da lista 
// Usar o JSON.stringfy para transformar o array de objetos em uma string e depos jogar pro localStorage
// Retornar do localStorage usando o JSON.parse para converter de string para array.
let sum = 0;
let subtract = 0;

function loading() {
  const div = document.createElement('div');
  div.classList = 'loading';
  div.innerText = 'loading...';
  const container = document.querySelector('.container');
  container.firstElementChild.appendChild(div);
}

function getOutLoading() {
  const loadingItem = document.querySelector('.loading');
  loadingItem.remove();
}

function fetchApi(url) {
  loading();
  return fetch(url)
    .then((response) => response.json())
    .then((respo) => respo.results);
}

function addToLocalStorage(itemId, element) {
  const value = element.querySelector('.item__title').textContent;
  localStorage.setItem(itemId, value);
}

function removeOfLocalStorage(element) {
  localStorage.removeItem(localStorage.key(element));
}

const sumPrices = (item) => {
  const price = item;
  sum += price;
  return item !== undefined ? sum : 0;
};

const subtractPrices = (item) => {
  const price = item;
  subtract += price;
  return item !== undefined ? subtract : 0;
};

function calculatePrices() {
  const total = sumPrices() - subtractPrices();
  return total;
}
calculatePrices();
// function creatItemPrices(price) {
//   const currentPrice = sumPrices(price);
//   const totalPrice = document.createElement('span');
//   totalPrice.innerHTML = '';
//   totalPrice.className = 'cart__price';
//   totalPrice.innerText = `Preço total: $${currentPrice}`;
//   return totalPrice;
// }

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
  const click = event.target;
  console.log(`Click ${click}`);
  click.remove();
  removeOfLocalStorage(click);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // console.log(`salePrice: ${salePrice}`);
  // console.log(`sumPrices: ${sumPrices(salePrice)}`);
  return li;
}

function fetchItems(items) {
  fetch(`https://api.mercadolibre.com/items/${items}`)
    .then((response) => response.json())
    .then((result) => {
      const itemCart = createCartItemElement({
        sku: result.id,
        name: result.title,
        salePrice: result.price,
      });
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(itemCart);
    });
}

async function addToShoppingCart(sku) {
  await fetchItems(sku);
}

function getButtons(element) {
  const addButtons = element.querySelector('.item__add');
  const sku = getSkuFromProductItem(element);
  addButtons.addEventListener('click', () => addToShoppingCart(sku));
  addButtons.addEventListener('click', () => addToLocalStorage(sku, element));
}

function productsList() {
  const itensSection = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchApi(url)
    .then((results) => {
      results.forEach((element) => {
        const product = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        itensSection.appendChild(product);
        getButtons(product);
      });
    });
  getOutLoading();
}

function getAll() {
  for (let index = (localStorage.length - 1); index >= 0; index -= 1) {
    const element = localStorage.key(index);
    console.log(element);
    addToShoppingCart(element);
  }
}

function cleanCart() {
  const emptyCart = document.querySelector('.empty-cart');
  console.log(emptyCart);
  emptyCart.addEventListener('click', () => {
    localStorage.clear();
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
}
// emptyCart.addEventListener('click', cleanCart);
// emptyCart.addEventListener('click', () => {
//   localStorage.clear();
//   const ol = document.querySelector('.cart__items');
//   ol.innerHTML = '';
// });

window.onload = function onload() {
  productsList();
  getAll();
  cleanCart();
};
