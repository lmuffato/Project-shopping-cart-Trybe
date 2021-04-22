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
  const items = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  items.appendChild(section);
  return section;
}

const listElements = () => document.querySelector('.cart__items');

const setLocalStorage = () => localStorage.setItem('item', listElements().innerHTML);

const cartItemClickListener = (event) => event.target.remove();

const getLocalStorage = () => {
  const elements = localStorage.getItem('item');
  const everyElements = document.querySelectorAll('.cart__items');
  listElements().innerHTML = elements;
  everyElements.forEach((element) => element.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  listElements().appendChild(li);
  return li;
}

const getAPI = async () => {
  const fetchAPI = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const products = await fetchAPI.json();
  const endProducts = await products.results;
  return endProducts;
};

const requisiteProduct = async (product) => {
  const fetchAPI = await fetch(`https://api.mercadolibre.com/items/${product}`);
  const filteredItem = await fetchAPI.json();
  return filteredItem;
};

const addProductScreen = async () => {
    const arrayResults = await getAPI();
    return arrayResults.forEach((element) => {
      const items = { sku: element.id, name: element.title, image: element.thumbnail };
      createProductItemElement(items);
    });
};

const addEvent = async () => {
  const buttons = document.querySelectorAll('.item__add');
  return buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const idProduct = button.parentNode.children[0].innerHTML;
      const objectAPI = await requisiteProduct(idProduct);
      const product = { sku: objectAPI.id, name: objectAPI.title, salePrice: objectAPI.price };
      createCartItemElement(product);
      setLocalStorage();
    });
  });
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const removeItems = () => {
  const button = document.querySelector('.empty-cart');
  return button.addEventListener('click', () => {
    listElements().innerHTML = '';
  });
};

const createPage = async () => {
  try {
    await addProductScreen();
    await addEvent();
    removeLoading();
    removeItems();
    getLocalStorage();
  } catch (error) {
    return console.log('error2');
  }
};

window.onload = function onload() { 
  createPage();
};
// Referêcias utilizadas para realização do projeto
// https://medium.com/jaguaribetech/dlskaddaldkslkdlskdlk-333dae8ef9b8
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/30/commits/3f3791797ece0b2faf08c88a432028a7a2025687
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/81/commits/85a5fed09636eb93388ae6b8ab5981bf1fe65edb
