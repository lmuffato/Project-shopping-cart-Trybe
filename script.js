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
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const click = event.target;
  click.remove();
}

// funções de fetch, 1 e 2 requisito

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector('ol.cart__items').appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createCartItem = ({ sku }) => {
  const everyItem = document.querySelector('.item__add');
  everyItem.addEventListener('click', async () => {
   const idSku = sku;
   const getItems = await fetch(`https://api.mercadolibre.com/items/${idSku}`)
    .then((result) => result.json());
   const getPrice = { sku: idSku, name: getItems.title, salePrice: getItems.price };
   createCartItemElement(getPrice);
   savingItems();
 });
};

async function fetchProducts() {
  const getProduct = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((data) => data.results);
    getProduct.forEach((item) => {
    const receivedItems = { sku: item.id, name: item.title, image: item.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(receivedItems));
    createCartItem(receivedItems);
  });
}

// referência Patrick, turma A. Me deu noção de como fazer o botão de maneira pragmática.
// const clearingCart = () => {
//   const cartList = document.querySelector(cartItems);
//   cartList.innerHTML = '';
//     savingItems();
// };

// const clear = document.getElementsByClassName ('empty-cart')[0];
// clear.addEventListener('click', clearingCart)

window.onload = function onload() { };
fetchProducts();
// clearingCart();
