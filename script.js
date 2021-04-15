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

const fetchResponse = async (URL) => {
  try {
  const response = await fetch(URL);
  const jsonResponse = await response.json();
  return jsonResponse;
  } catch (error) {
    alert(error);
  }
};

const foundItemsByType = async (query = 'computador') => {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  return fetchResponse(URL);
};

const foundItemsById = async (ItemID) => {
  const URL = `https://api.mercadolibre.com/items/${ItemID}`;
  return fetchResponse(URL);
};

const createItemsSection = (data) => {
  const items = document.querySelector('.items');
  data.results.forEach((item) => {
    const object = { sku: item.id, name: item.title, image: item.thumbnail };
    const element = createProductItemElement(object);
    items.appendChild(element);
  });
};

const cartItemClickListener = (event) => {
    event.target.remove();// https://developer.mozilla.org/pt-BR/docs/Web/API/ChildNode/remove
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const itemClickListener = () => {
  const selectButtons = document.querySelectorAll('.item__add');
  const selectOl = document.querySelector('.cart__items');
  selectButtons.forEach((button) => button.addEventListener('click', async (event) => {
    const itemID = getSkuFromProductItem(event.target.parentNode); /* https://developer.mozilla.org/pt-BR/docs/Web/API/Node/parentNode */
    const itemSearched = await foundItemsById(itemID);
    const obj = { sku: itemSearched.id, name: itemSearched.title, salePrice: itemSearched.price };
    selectOl.appendChild(createCartItemElement(obj));
  }));
};

window.onload = async function onload() {
  try {
    await foundItemsByType().then((data) => createItemsSection(data));
    await itemClickListener();
  } catch (error) {
    alert(error);
  }
};