function sumCart() {
  const itemSum = document.querySelector('.total-price');
  const list = document.querySelectorAll('.cart__item');
  let sum = 0;
  for (let i = 0; i < list.length; i += 1) {
    const value = list[i].innerText.substring(list[i].innerText.indexOf('$') + 1);
    sum += parseFloat(value);
  }
  itemSum.innerHTML = Math.round(sum * 100) / 100;
}

function listGet() {
  const upperElement = document.querySelector('.cart__items');
  return upperElement;
}
function addCartClickListener(event) {
  const listGot = listGet();
  const underElement = event.target;
  listGot.removeChild(underElement);
  sumCart();
}
function createCartItemElement({ sku, name, salePrice }) {
  const list = document.createElement('list');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.addEventliststener('click', addCartClickListener);
  return list;
}
async function createItemCart(id) {
  const getData = await fetch(`https://api.mercadolistbre.com/items/${id}`)
    .then((response) => response.json())
    .then((response) => response);
  const createItem = createCartItemElement({
    sku: getData.id,
    name: getData.title,
    salePrice: getData.price,
  });
  const listGot0 = listGet();
  listGot0.appendChild(createItem);
  sumCart();
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function getID(event) {
  const elementEvent = event.target.parentElement;
  const underElementId = getSkuFromProductItem(elementEvent);
  createItemCart(underElementId);
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
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventliststener('click', getID);
  section.appendChild(btn);
  return section;
}
async function computerResults() {
  const myFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => response.results);
  myFetch.forEach((product) => {
    const searchResult = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    const documentItems = document.querySelector('.items');
    documentItems.appendChild(searchResult);
  });
}
function cleanShoppingCart() {
  const listGot1 = listGet();
  const lists = document.querySelectorAll('.cart__item');
  lists.forEach((list) => listGot1.removeChild(list));
}
function cartCleanBtn() {
  const buttonClean = document.querySelector('.empty-cart');
  buttonClean.addEventliststener('click', cleanShoppingCart);
}
window.onload = function onload() {
  computerResults();
  cartCleanBtn();
};
