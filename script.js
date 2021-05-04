let totalPrice = 0;
const clearCartButton = document.getElementById('ccbutton');
function findItem(item) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
}

const loading = () => {
  const load = document.getElementById('load');
  load.remove();
};

async function subPrice(price) {
  totalPrice -= Math.round(price * 100) / 100;
  return totalPrice;
}

function getItem(item) {
  return findItem(item).then((response) => response.json())
  .then((data) => {
    const result = [];
    data.results.forEach((element) => {
      const { id, title, thumbnail, price } = element;
      result.push({ id, title, thumbnail, price });
    });
    return result;
  });
}

const addOrRemoveOfStorage = (event) => {
  if (Object.values(event.target.classList).includes('item__add' || 'priceElement')) {
    const entireList = Object.values(document.getElementById('list').children);
    const outerList = [];
    entireList.forEach((element) => outerList.push(element.outerHTML));
    localStorage.setItem('ShopCart', JSON.stringify(outerList));
  }
};

const clearShopcart = () => {
  const cart = document.getElementById('list');
  const cartItems = Object.values(document.getElementById('list').children);
  cartItems.forEach((element) => {
      cart.removeChild(element);
  });
  localStorage.removeItem('ShopCart');
  const priceElement = document.getElementById('priceElement');
  document.getElementById('cartId').removeChild(priceElement);
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

const addOnPriceElement = (price) => {
  const el = document.getElementById('priceElement');
  el.innerText = price;
};

function cartItemClickListener(event) {
  if (event.target.outerHTML.includes('li')) {
    const element = event.target;
    const price = parseFloat(event.target.outerText.split('$')[1]);
    subPrice(price).then((response) => addOnPriceElement(response));
    document.getElementById('list').removeChild(element);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function sumPrice(price) {
  totalPrice += Math.round(price * 100) / 100;
  return totalPrice;
}

const createLanding = () => {
  getItem().then((response) => {
    loading();
    response.forEach((element) => {
      const { id, title, thumbnail } = element;
      const data = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const section = createProductItemElement(data);
      document.getElementById('main').appendChild(section);
    });
  });
};

const addCartItem = (event) => {
  if (Object.values(event.target.classList).includes('item__add')) {
    const sku = Object.values(event.target.parentElement.children)
    .map((element) => element.innerHTML).filter((element) => element.includes('MLB')).join();
    const name = Object.values(event.target.parentElement.children)
    .map((element) => element.innerHTML)[1];
    getItem(name).then((response) => response.filter((element) => element.id === sku).shift())
    .then((data) => {
      const { id, price, title } = data;
      const obj = { sku: id, name: title, salePrice: price };
      const cartItem = createCartItemElement(obj);
      document.getElementsByClassName('cart__items')[0].appendChild(cartItem);
      addOrRemoveOfStorage(event);
      sumPrice(price).then((response) => addOnPriceElement(response));
    });
  }
};

const loadLocalStorage = () => {
  let data = localStorage.getItem('ShopCart');
  if (data !== (null && undefined)) {
    const list = document.getElementById('list');
    data = JSON.parse(data);
    data.forEach((element) => {
      const el = document.createElement('p');
      el.innerHTML = element;
      el.children[0].addEventListener('click', cartItemClickListener);
      list.appendChild(el.children[0]);
    });
  }
};

window.onload = function onload() {
  loadLocalStorage();
  createLanding();
  clearCartButton.addEventListener('click', clearShopcart);
  document.body.addEventListener('click', addCartItem);
};
