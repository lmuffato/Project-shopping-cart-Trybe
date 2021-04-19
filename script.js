function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const getPriceHtml = () => document.querySelector('.total-price');

const getCartList = () => document.querySelectorAll('.cart__items');

const storeItems = () => {
  const items = getCartList();
  items.forEach((item) => localStorage.setItem('myCart', item.innerHTML));
  const cartPrice = getPriceHtml().innerHTML;
  localStorage.setItem('cartPrice', cartPrice);
};

const loadItems = () => {
  const itemsStorage = getCartList();
  itemsStorage.forEach((item) => {
    const loadItem = item;
    loadItem.innerHTML = localStorage.getItem('myCart');
  });
  const price = getPriceHtml();
  price.innerHTML = localStorage.getItem('cartPrice');
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

let totalPrice = 0;
let toDecrease = 0;
function cartItemClickListener(event) {
  const parent = event.target.parentNode;
  parent.removeChild(event.target);
}

const updatePrice = (price) => {
  totalPrice += price;
  return totalPrice;
};

const calculateCartPrice = (data) => {
  const cartPrice = Math.round(updatePrice(data.price) * 100) / 100;
  const finalPrice = getPriceHtml();
  finalPrice.innerText = cartPrice;
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', () => {
    toDecrease = price * (-1);
    const cartPrice = Math.round(updatePrice(toDecrease) * 100) / 100;
    const finalPrice = getPriceHtml();
    finalPrice.innerText = cartPrice;
  });
  return li;
}

const getCartItems = () => document.querySelector('.cart__items');

const emptyCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    const cart = getCartItems();
    const items = document.querySelectorAll('.cart__item');
    items.forEach((item) => cart.removeChild(item));
    totalPrice = 0;
    const finalPrice = getPriceHtml();
    finalPrice.innerText = 0;
    localStorage.clear();
  });
};

const fetchProduct = (product) => {
  const container = document.querySelector('.container');
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  container.appendChild(loading);
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
      .then((response) => {
        response.json().then((data) => {
          container.removeChild(loading);
          resolve(data);
        });
      });
  });
};

const appendItems = async (product) => {
  const data = await fetchProduct(product);
  const items = await document.querySelector('.items');
  data.results.forEach((element) => {
    const result = createProductItemElement(element);
    items.appendChild(result);
  });
  loadItems();
};

const fetchId = (itemId) => (
  new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((result) => {
      result.json().then((data) => {
        resolve(data);
      });
    });
  })
);

const appendToCart = async (data) => {
  const cart = await createCartItemElement(data);
  calculateCartPrice(data);
  const cartList = getCartItems();
  cartList.appendChild(cart);
  storeItems();
};

const addToCart = async (product, target) => {
  const id = target.previousSibling.previousSibling.previousSibling.innerText;
  const idData = await fetchId(id);
  appendToCart(idData);  
};

const addToCartEvent = (product) => {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.addEventListener('click', (event) => (
    event.target.classList.contains('item__add') ? addToCart(product, event.target) : undefined
  ));
};

window.onload = function onload() {
  const product = 'computador';
  appendItems(product);
  addToCartEvent(product);
  emptyCart();
 };