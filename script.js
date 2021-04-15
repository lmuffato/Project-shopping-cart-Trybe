const selectOl = document.querySelector('.cart__items');

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

const roundNum = (number) => parseFloat((Math.round(number * 100) / 100).toFixed(2));

const priceSum = async (itemID) => {
  const data = await foundItemsById(itemID);
  const spanTextPrice = document.querySelector('.total-price');
  let sum = parseFloat(spanTextPrice.innerText);
  sum += data.price;
  spanTextPrice.innerText = roundNum(sum);
};

const shoppingCartValue = () => {
  const spanTextPrice = document.querySelector('.total-price');
  spanTextPrice.innerText = 0;
  if (localStorage.length > 0) {
    let acc = 0;
    Object.values(localStorage).forEach((value) => {
      acc += JSON.parse(value).salePrice; /* Json.parse() https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse */
    });
    spanTextPrice.innerText = roundNum(acc);
  }
};

const clearCardItems = () => {
  const selectButton = document.querySelector('.empty-cart');
  selectButton.addEventListener('click', () => {
    selectOl.innerHTML = '';
    localStorage.clear();
    shoppingCartValue();
});
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
  const textProductID = event.target.innerText.split('').splice(5, 13).join('');
  const obj = [...Object.entries(localStorage)];
  for (let index = 0; index < obj.length; index += 1) {
    const [position, data] = obj[index];
    const searchKey = JSON.parse(data).sku;/* https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse */
    if (textProductID === searchKey) {
      localStorage.removeItem(position);
      break;
    }
  }
  if (localStorage.length === 0) {
    selectOl.innerHTML = '';
  }
  event.target.remove();// https://developer.mozilla.org/pt-BR/docs/Web/API/ChildNode/remove
  shoppingCartValue();
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
  selectButtons.forEach((button) => button.addEventListener('click', async (event) => {
    const itemID = getSkuFromProductItem(event.target.parentNode); /* .parentNode https://developer.mozilla.org/pt-BR/docs/Web/API/Node/parentNode */
    const itemSearched = await foundItemsById(itemID);
    const obj = { sku: itemSearched.id, name: itemSearched.title, salePrice: itemSearched.price };
    localStorage.setItem(localStorage.length, JSON.stringify(obj)); /* .stringify() https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify */
    selectOl.appendChild(createCartItemElement(obj));
    await priceSum(itemSearched.id);
  }));
};

function loadCardItems() {
  const keys = Object.entries(localStorage);
  keys.sort((a, b) => Number(a[0]) - Number(b[0])); /* Number() https://www.w3schools.com/jsref/jsref_number.asp */
  keys.forEach((value) => {
    const obj = JSON.parse(value[1]);
    const cartObject = { sku: obj.sku, name: obj.name, salePrice: obj.salePrice };
    selectOl.appendChild(createCartItemElement(cartObject));
  });
}

window.onload = async function onload() {
  try {
    await foundItemsByType().then((data) => createItemsSection(data));
    await itemClickListener();
    clearCardItems();
    loadCardItems();
    shoppingCartValue();
    document.querySelector('.loading').remove();
  } catch (error) {
    alert(error);
  }
};