// Jogar os itens que vão pro localStorage dentro de uma lista e depois recuperar os objetos de dentro da lista 
// Usar o JSON.stringfy para transformar o array de objetos em uma string e depos jogar pro localStorage
// Retornar do localStorage usando o JSON.parse para converter de string para array.
// const myObj = {};
const myArray = [];
// ---------------------------------------------------- Loading -------------------------------------------------------------------

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

// ----------------------------------------------------- Storage ------------------------------------------------------------------

function addToLocalStorage(itemId, element) {
  const value = element.querySelector('.item__title').textContent;
  localStorage.setItem(itemId, value);
}

function removeOfLocalStorage(element) {
  localStorage.removeItem(localStorage.key(element));
}

// ------------------------------------------------------ Cart Price --------------------------------------------------------------

// Jogar tudo dentro de um objeto usando o SKU como chave, depois usar o Object.values para retornar um array de valores e usar o reduce pra somar esses valores.
function prices() {
  let value = 0;
  value = myArray.map((object) => object.salePrice).reduce((acc, curr) => acc + curr, 0);
  return value;
}

// Salvar todos os itens do shoppingCart em um array, fazer o map percorrer esse array e pegar o valor da chave price, depois dar um reduce nos valores desse array

function creatElementP() {
  const p = document.createElement('p');
  p.classList = 'cart_price';
  p.innerHTML = 'Preço total: $<span class = "total-price">0</span>';
  const cartList = document.querySelector('.cart');
  cartList.appendChild(p);
}

function returnFixed(htmlItem, currentPrice, stringCurrentPrice) {
  const span = htmlItem;
    if (stringCurrentPrice[stringCurrentPrice.length - 1] === '0') {
      span.innerText = `${currentPrice.toFixed(1)}`;
    } else {
      span.innerText = `${currentPrice.toFixed(2)}`;
    }
}

function refreshShoppingCartPrice() {
  const span = document.querySelector('.total-price');
  const currentPrice = prices();
  const stringCurrentPrice = currentPrice.toFixed(2).toString();
  if (currentPrice > currentPrice.toFixed() || currentPrice < currentPrice.toFixed()) {
    returnFixed(span, currentPrice, stringCurrentPrice);
  } else {
    span.innerText = `${currentPrice.toFixed()}`;
  }
}

// ------------------------------------------------------- Base -------------------------------------------------------------------

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
  const clickContent = click.innerHTML;
  myArray.map((object) => object.sku).forEach((id, index) => {
    if (clickContent.includes(id)) {
      myArray.splice(index, 1);
      return myArray;
    }
  });

  click.remove();
  removeOfLocalStorage(click);
  refreshShoppingCartPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ------------------------------------------------------ Cart --------------------------------------------------------------------

function fetchItems(items) {
  return fetch(`https://api.mercadolibre.com/items/${items}`)
    .then((response) => response.json())
    .then((result) => {
      const myObj = {
        sku: result.id,
        name: result.title,
        salePrice: result.price,
      };
      const itemCart = createCartItemElement(myObj);
      const cartList = document.querySelector('.cart__items');
      myArray.push(myObj);
      cartList.appendChild(itemCart);
    });
}
async function addItemToShoppingCart(sku) {
  await fetchItems(sku);
  refreshShoppingCartPrice();
}
function getButtons(element) {
  const addButtons = element.querySelector('.item__add');
  const sku = getSkuFromProductItem(element);
  addButtons.addEventListener('click', () => addItemToShoppingCart(sku));
  addButtons.addEventListener('click', () => addToLocalStorage(sku, element));
}

function cleanCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    localStorage.clear();
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
}

// ---------------------------------------------------- Product List --------------------------------------------------------------

function fetchApi(url) {
  loading();
  return fetch(url)
    .then((response) => response.json())
    .then((respo) => respo.results);
}

async function productsList() {
  const itensSection = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetchApi(url)
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
    addItemToShoppingCart(element);
  }
}

window.onload = function onload() {
  loading();
  getOutLoading();
  productsList();
  creatElementP();
  getAll();
  cleanCart();
};
