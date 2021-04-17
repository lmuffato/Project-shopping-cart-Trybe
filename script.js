// PROJECT SHOPPING CART

const getCartList = () => document.querySelector('.cart__items');

const totalPriceElem = document.createElement('p');
totalPriceElem.className = 'total-price';
let totalPrice;

const updateTotalPrice = (productsObj) => {
  const values = productsObj.map((product) => product.salePrice);
  totalPrice = values.reduce((acc, value) => acc + value, 0);

  document.querySelector('.cart').appendChild(totalPriceElem);
  totalPriceElem.innerText = totalPrice;
};

let listStorage = [];

const setStorage = (objProduct) => {
  listStorage.push(objProduct);
  localStorage.setItem('listProducts', JSON.stringify(listStorage));
  updateTotalPrice(listStorage);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const removeItem = (sku) => {
  const indexItemToRemove = listStorage.findIndex((item) => item.sku === sku);
  listStorage.splice(indexItemToRemove, 1);
  localStorage.setItem('listProducts', JSON.stringify(listStorage));
  updateTotalPrice(listStorage);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  getCartList().removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

  li.addEventListener('click', () => removeItem(sku));
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const fechProductById = async (itemId) => {
  const URL = `https://api.mercadolibre.com/items/${itemId}`;
  const dataFetch = await fetch(URL);
  const data = await dataFetch.json();

  document.querySelector('.loading').remove();

  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };

  const itemList = createCartItemElement(obj);
  getCartList().appendChild(itemList);

  setStorage(obj);
};

const createLoadingElem = () => {
  const loadingElem = document.createElement('p');
  document.body.insertBefore(loadingElem, document.body.childNodes[0]);
  loadingElem.className = 'loading';
  loadingElem.innerText = 'Loading';
};

function productClickListener(event) {
  // coloque seu código aqui
  const id = getSkuFromProductItem(event.target.parentNode);
  createLoadingElem();
  fechProductById(id);
}

const clickButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) =>
    button.addEventListener('click', productClickListener));
};

const loadStorage = () => {
  const storage = JSON.parse(localStorage.getItem('listProducts'));

  if (storage !== null) {
    storage.forEach((product) => {
      const item = createCartItemElement(product);
      getCartList().appendChild(item);
      setStorage(product);
    });
  }
};

const fetchProducts = async () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const dataFetch = await fetch(URL);
  const data = await dataFetch.json();

  document.querySelector('.loading').remove();
  const sectionItems = document.querySelector('.items');

  data.results.forEach(({ id, title, thumbnail }) => {
    const obj = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const item = createProductItemElement(obj);
    sectionItems.appendChild(item);
  });
  clickButton();
  loadStorage();
};

const clearAll = () => {
  listStorage.forEach((item) => getCartList().firstElementChild.remove(item));

  listStorage = [];
  localStorage.setItem('listProducts', JSON.stringify(listStorage));
  updateTotalPrice([{ salePrice: 0 }]);
};

const clearAllClickListener = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearAll);
};

window.onload = function onload() {
  fetchProducts();
  clearAllClickListener();
};
