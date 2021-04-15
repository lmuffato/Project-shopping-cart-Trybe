const API_URL_PRODUCTS = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const API_URL_ITEM = 'https://api.mercadolibre.com/items/';
let totalPrice = 0;

const getCurrentCartList = () => {
  const items = document.querySelectorAll('.cart__item');
  const list = Object.values(items).map((item) => item.id);
  return list;
};

const saveCartList = () => {
  localStorage.setItem('cart_items', getCurrentCartList());
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const appendProduct = (product) => {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(createProductItemElement(product));
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const sumPrice = async (price) => {
  totalPrice += price;
  return totalPrice;
};

const subPrice = async (price) => {
  totalPrice -= price;
  return totalPrice;
};

const showTotalPrice = async (price, operation) => {
  const finalPrice = await operation(price);
  const totalPriceConteiner = document.querySelector('.total-price');
  totalPriceConteiner.innerHTML = finalPrice;
};

const cartItemClickListener = (event) => {
  const price = Number(event.target.innerHTML.split('PRICE: $')[1]);
  showTotalPrice(price, subPrice);
  event.target.remove();
  saveCartList();
};

const addCartItem = (item) => {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(item));
  showTotalPrice(item.price, sumPrice);
};

const fetchItem = (sku) => fetch(`${API_URL_ITEM}${sku}`)
  .then((response) => response.json())
  .then((data) => data)
  .catch((error) => console.log(error));

const showItems = (itemsIds) => {
  if (itemsIds) {
    itemsIds.split(',').forEach((sku) => {
      fetchItem(sku)
      .then((data) => addCartItem(data));
    });
  }
};

const getLocalCartList = () => {
  if (localStorage) showItems(localStorage.getItem('cart_items'));
};

const cartButtonEvent = () => {
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const sku = getSkuFromProductItem(e.target.parentNode);
      fetchItem(sku)
      .then((data) => {
        addCartItem(data);
        saveCartList();
      });
    });
  });
};

const fetchProducts = () => {
  fetch(API_URL_PRODUCTS)
  .then((response) => response.json())
  .then(({ results }) => results.forEach((product) => appendProduct(product)))
  .then(() => cartButtonEvent()) 
  .catch((error) => console.log(error));
};

const emptyCartButton = document.querySelector('.empty-cart');
emptyCartButton.addEventListener('click', () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  saveCartList();
});

window.onload = function onload() { 
  fetchProducts();
  getLocalCartList();
};
