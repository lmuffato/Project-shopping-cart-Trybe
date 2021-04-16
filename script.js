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

const createProductItemElement = ({ sku: id, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.parentNode.firstChild.innerText;

const calculateTotalPrice = async () => {
  const cartItems = document.querySelectorAll('li.cart__item');
  const totalPrice = Array.from(cartItems).reduce((total, item) => {
    const priceIndex = item.innerText.lastIndexOf('PRICE');
    return (total + Number(item.innerText.substr(priceIndex + 8)));
  }, 0);
  const priceSpan = document.querySelector('span.total-price');
  // priceSpan.innerText = Math.round(totalPrice * 100) / 100;
  priceSpan.innerText = totalPrice;
};

const getCartItems = () => document.querySelector('ol.cart__items');
const saveCart = () => {
  localStorage.setItem('cart', getCartItems().innerHTML);
  calculateTotalPrice();
};

const cartItemClickListener = (event) => {
  event.target.remove();
  saveCart();
};

const createCartItemElement = ({ sku: id, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

/**
 * Cria a Url do site sem os parâmetros de busca.
 * @param {string} siteId Nome do site.
 * @returns Retorna a URL completa do site.
 */
const sites = (siteId) => `sites/${siteId}/search?`;

/**
 * @param {string} userId Nome do usuário.
 * @returns Retorna a URL completa do usuário.
 */
const user = (userId) => `users/${userId}/items/search`;
const users = (usersId) => `users/ids=${usersId}`;
const queries = (queries) => queries;

const createUrl = (cb) => {
  // https://api.mercadolibre.com/sites/MLB/search?q=computador

};

// /sites/$SITE_ID/search?
// /users/$USER_ID/items/search
// /users?ids=$USER_ID1,$USER_ID2
const fetchProductList = async (query) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const productList = await response.json();
  return productList;
};

const fetchItemById = async (itemID) => {
  const fetchResponse = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const item = await fetchResponse.json();
  return item;
};

async function addToCart(event) {
  const itemId = getSkuFromProductItem(event.target); // event.target.parentNode.firstChild.innerText;
  console.log(itemId);
  const item = await fetchItemById(itemId);
  const cartItem = createCartItemElement({
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  });
  getCartItems().appendChild(cartItem);
  saveCart();
}

async function createItemList(query) {
  const itemsSection = document.querySelector('section.items');
  const products = await fetchProductList(query);
  document.querySelector('span.loading').remove();
  products.results.forEach((product) => {
    const productItem = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    itemsSection.appendChild(productItem);
  });
  const addCartButtonList = document.querySelectorAll('button.item__add');
  addCartButtonList.forEach((button) => button.addEventListener('click', addToCart));
}

const loadCart = () => {
  getCartItems().innerHTML = localStorage.getItem('cart');
  const cartItems = document.querySelectorAll('li.cart__item');
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  calculateTotalPrice();
};

const emptyCart = () => {
  getCartItems().innerHTML = '';
  saveCart();
};

window.onload = function onload() {
  createItemList('computador');
  loadCart();
  const emptyCartButton = document.querySelector('button.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
};