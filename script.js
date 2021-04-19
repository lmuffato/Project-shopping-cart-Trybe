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
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

const getCartItems = () => document.querySelector('.cart__items');

const updateTotalCartPrice = async () => {
  let totalCartPrice = 0;
  getCartItems().childNodes.forEach((product) => {
    totalCartPrice += parseFloat(product.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = totalCartPrice;
};

const saveCartToLocalStorage = () => {
  localStorage.setItem('cartList', document.querySelector('.cart').outerHTML);
};

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.outerHTML = '';
  updateTotalCartPrice();
  saveCartToLocalStorage();
  return null;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getCartItemData = async (itemId) => {
  const endPoint = `https://api.mercadolibre.com/items/${itemId}`;
  const response = await fetch(endPoint);
  const data = await response.json();
  const singleItemInfo = { 
    sku: data.id, 
    name: data.title, 
    salePrice: data.price,
  };
  return singleItemInfo;
};

const displayLoader = (bool) => {
  if (!bool) {
    document.querySelector('.loading').outerHTML = '';
  } else {
    document.querySelector('.loading').style.display = 'block';
  }
};

const addQueryResultToPage = async (endpoint) => {
  displayLoader(true);
  const response = await fetch(endpoint);
  const data = await response.json();
  displayLoader(false);
  const itemsFullList = data.results;
  itemsFullList.forEach((item) => {
    const itemInfo = { sku: item.id, name: item.title, image: item.thumbnail };
    const newSectionItem = createProductItemElement(itemInfo);
    newSectionItem.lastChild.addEventListener('click', async () => {
      const singleItemInfo = await getCartItemData(item.id);
      document.querySelector('.cart__items').appendChild(createCartItemElement(singleItemInfo));
      updateTotalCartPrice();
      saveCartToLocalStorage();
    });
    document.querySelector('.items').appendChild(newSectionItem);
  });
};

window.onload = function onload() { 
  addQueryResultToPage('https://api.mercadolibre.com/sites/MLB/search?q=computador');

  if (localStorage.cartList) {
    document.querySelector('.cart').outerHTML = localStorage.cartList;
    getCartItems().childNodes.forEach((cartItem) => {
      cartItem.addEventListener('click', cartItemClickListener);
    });
  }

  document.querySelector('.empty-cart').addEventListener('click', () => {
    getCartItems().innerText = '';
    updateTotalCartPrice();
    saveCartToLocalStorage();
  });
};
