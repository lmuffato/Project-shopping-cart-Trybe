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

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.removeItem(localStorage.key(event));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loading() {
  const load = document.createElement('p');
  const selectCart = document.querySelector('.cart');
  load.innerText = 'loading...';
  load.className = 'loading';
  selectCart.appendChild(load);
}

function removeLoading() {
  const selectLoading = document.querySelector('.loading');
  selectLoading.remove();
}

 function addItens(itemId) {
   return new Promise((resolve) => {
    loading();
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }
      const { id: sku, title: name, price: salePrice } = data;
      const cartShopping = document.querySelector('.cart__items');
      const element = createCartItemElement({ sku, name, salePrice });
      localStorage.setItem(itemId, element.innerHTML);
      cartShopping.appendChild(element);
      removeLoading();
      resolve();
    });
   });
 }

function fetchComputers(product) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.error) {
      throw new Error(data.error);
    }
    data.results.forEach((result) => {
      const { id: sku, title: name, thumbnail: image } = result;
      const createElement = createProductItemElement({ sku, name, image });
      const listItens = document.querySelector('.items');
      const button = createElement.querySelector('.item__add');
      listItens.appendChild(createElement);
      button.addEventListener('click', () => addItens(sku));
      resolve();
    });
  });
  }); 
}

function cleanCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const selectCart = document.querySelector('.cart_item');
    selectCart.innerText = ' ';
    localStorage.clear();
  });
} 

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function storage() {
  const shoppingCart = document.querySelector('.cart__items');
  Object.values(localStorage).forEach((item) => {
    const getLi = document.createElement('li');
    getLi.innerText = `${item}`;
    getLi.addEventListener('click', cartItemClickListener);
    shoppingCart.appendChild(getLi);
  });
}

window.onload = function onload() {
  fetchComputers('computador');
  storage();
  cleanCart();
};
