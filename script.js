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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  const containerItems = document.querySelector('.cart__items');
  containerItems.removeChild(event.target);
} 

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchAndRenderProduct() {
  const selectItems = document.querySelector('.items');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        selectItems.appendChild(createProductItemElement({ sku, name, image }));
      });
    });
}

function saveItemsLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart__items', cartItems);
}

async function addItemCart(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const containerCart = document.querySelector('.cart_items');
  const itemFetch = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => data);
  const { id: sku, title: name, price: salePrice } = itemFetch;
  const carItem = createCartItemElement({ sku, name, salePrice });
  containerCart.appendChild(carItem);
}

window.onload = function onload() { // chama as funções ao carregar a pagina
  fetchAndRenderProduct();
  addItemCart();
  saveItemsLocalStorage();
  cartItemClickListener();
};