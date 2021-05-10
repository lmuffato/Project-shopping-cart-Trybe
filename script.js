async function fetchUrl(url) {
  const resp = await fetch(url);
  const finalFetch = await resp.json();
  return finalFetch;
}

function fetchComputers() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetchUrl(url);
}

function fetchItemsById(ItemID) {
  const url = `https://api.mercadolibre.com/items/${ItemID}`;
  return fetchUrl(url);
}

const cart = document.querySelector('.cart__items');
const price = document.querySelector('.total-price');

function saveLocal() {
  localStorage.setItem('salvaCarrinho', cart.innerHTML);
  localStorage.setItem('price', price.innerHTML);
}

function priceSum() {
  let sum = 0;
  const cartOl = document.querySelectorAll('.cart__item');
  cartOl.forEach((cartItem) => {
    const index = cartItem.innerText.lastIndexOf('$');
    const value = cartItem.innerText.substr(index + 1);
    sum += Number(value);
  });
  const totalPriceSpan = document.querySelector('.total-price');
  totalPriceSpan.innerText = sum;
  return sum;
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
  const loading = document.querySelector('.loading');
  if (loading) {
    loading.remove();
  }
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  priceSum();
  saveLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function removeSavedItems() {
  const liItems = document.querySelectorAll('li');
  liItems.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
    priceSum();
  });
}

function fetchProducts() {
  const mainItems = document.querySelector('.items');
  fetchComputers().then((data) => {
    data.results.forEach((computador) => {
      const { id: sku, title: name, thumbnail: image } = computador;
      const itemList = createProductItemElement({ sku, name, image });
      mainItems.appendChild(itemList);
  });
});
}

async function addItemsToCart() {
  const bttn = document.querySelectorAll('.item__add');
  bttn.forEach((id) => id.addEventListener('click', async function (retorno) {    
      const ids = getSkuFromProductItem(retorno.target.parentNode);
      const data = await fetchItemsById(ids);
      const { id: sku, title: name, price: salePrice } = data;
      cart.appendChild(createCartItemElement({ sku, name, salePrice }));
      saveLocal();
      await priceSum();
    }));
}

function emptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  const cartList = document.querySelector('ol');
  
  emptyButton.addEventListener('click', () => {
    cartList.innerHTML = '';
    price.innerText = 0;
    saveLocal();
  });
}

window.onload = function onload() {
  fetchProducts();
  emptyCart();
  setTimeout(() => removeSavedItems(), 300);
  setTimeout(() => addItemsToCart(), 300);
  cart.innerHTML = localStorage.getItem('salvaCarrinho');
  price.innerHTML = localStorage.getItem('price');
 };