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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const element = event.target;
  const sku = element.classList[1];

  element.remove();

  for (let i = 0; i < localStorage.length; i += 1) {
    if (sku === localStorage.getItem(localStorage.key(i))) {
      localStorage.removeItem(localStorage.key(i));
      break;
    }
  }

  return element;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');  
  li.className = `cart__item ${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(productInfo) {
  const { id, title, price } = productInfo;
  const cartItemList = document.getElementsByClassName('cart__items')[0];
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  cartItemList.appendChild(cartItem);
  return cartItem;
}

function setToLocalStorage(id) {
  const random = Math.round(Math.random() * 1000);

  localStorage.setItem(random, id);
}

function fetchSingleItem(id) {  
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then(async (productObj) => {
    addItemToCart(productObj);
  });
}

function fetchItemFromClick(e) {
  const thisElement = e.target.parentNode;
  const idValue = getSkuFromProductItem(thisElement);
  setToLocalStorage(idValue);
  fetchSingleItem(idValue);
}

function fetchItemsFromLocalStorage() {
  const ids = Object.values(localStorage);
  ids.forEach((id) => {
    fetchSingleItem(id);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const cartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  cartBtn.addEventListener('click', fetchItemFromClick);
  section.appendChild(cartBtn);

  return section;
}

function renderEachProduct(productsObject) {
  const itemsSection = document.getElementsByClassName('items')[0];

  productsObject.forEach((product) => {
    const { id, title, thumbnail } = product;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    itemsSection.appendChild(item);
  });

  return itemsSection;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => {
    const { results } = data;
    renderEachProduct(results);
    fetchItemsFromLocalStorage();
  });
};
