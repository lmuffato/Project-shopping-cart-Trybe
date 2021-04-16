const cartItems = '.cart__items';

function savingItems() {
  const cartLi = document.querySelector(cartItems);
  localStorage.setItem('items', cartLi.innerHTML);
}

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
  // const addItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // addItem.addEventListener('click', createCartItem);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   event.target.remove();
//   savingItems();
// }
// cartItemClickListener();

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchProducts() {
  const getProduct = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((data) => data.results);
    getProduct.forEach((item) => {
    const receivedItems = { sku: item.id, name: item.title, image: item.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(receivedItems));
  });
}

// const createCartItem = () => {
//   const everyItem = document.querySelector('.items');
//   everyItem.addEventListener('click', async (event) => {
//    const idSku = getSkuFromProductItem(event.target.parentElement);
//    const getItems = await fetch(`https://api.mercadolibre.com/items/${idSku}`)
//     .then((result) => result.json());
//    const getPrice = { sku: idSku, name: getItems.title, salePrice: getItems.price };
//    const cartLoad = createCartItemElement(getPrice);
//    document.querySelector('ol.cart__items').appendChild(cartLoad);
//    savingItems();
//  });
// };

// tentando de outra forma, já que o parent não estava funcionando.
async function createCartItem(sku) {
  const olList = document.querySelector(cartItems);
  const idToSku = sku;
  const result = await fetch(`https://api.mercadolibre.com/items/${idToSku}`);
  const json = await result.json()
  .then((item) => createCartItemElement({
        sku: item.id,
        name: item.title,
        salePrice: item.price,
   }));
  olList.appendChild(json);
  savingItems();
}

// referência Patrick, turma A. Me deu noção de como fazer o botão de maneira pragmática.
const clearingCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const clearingItems = document.querySelector(cartItems);
    clearingItems.innerHTML = '';
    savingItems();
  });
};

window.onload = function onload() { };
fetchProducts();
createCartItem();
clearingCart();
