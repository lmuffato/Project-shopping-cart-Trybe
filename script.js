function sumCart() {
  const elementSum = document.querySelector('.total-price');
  const li = document.querySelectorAll('.cart__item');
  let sum = 0;
  for (let i = 0; i < li.length; i += 1) {
      const value = li[i].innerText.substring(li[i].innerText.indexOf('$') + 1);
      sum += parseFloat(value);
  }
  elementSum.innerHTML = Math.round(sum * 100) / 100;
}

function getOrdList() {
  const elementFather = document.querySelector('.cart__items');
  return elementFather;
}

function cartItemClickListener(event) {
  const gotOrdList0 = getOrdList();
  const elementChild = event.target;
  gotOrdList0.removeChild(elementChild);
  sumCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addStorage() {
  const gotOrdList1 = getOrdList();
  gotOrdList1.innerHTML = localStorage.getItem('Product');
}

async function createItemCart(id) {
  const getData = await fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((response) => response);
  const createItem = createCartItemElement({
      sku: getData.id,
      name: getData.title,
      salePrice: getData.price,
  });
  const gotOrdList2 = getOrdList();
  gotOrdList2.appendChild(createItem);
  sumCart();
  localStorage.setItem('Product', gotOrdList2.innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getItemId(event) {
  const elementEvent = event.target.parentElement;
  const elementChildId = getSkuFromProductItem(elementEvent);
  createItemCart(elementChildId);
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

function loading() {
  const l = document.createElement('l');
  l.className = 'loading';
  l.innerText = 'loading...';
  document.body.appendChild(l);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventListener('click', getItemId);
  section.appendChild(btn);
  return section;
}

async function computerResults() {
  loading();
  const myFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((response) => response.results);
  document.querySelector('.loading').remove();
  myFetch.forEach((product) => {
      const createProduct = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
      });
      const sectionItems = document.querySelector('.items');
      sectionItems.appendChild(createProduct);
  });
}

function cleanShoppingCart() {
  const gotOrdList3 = getOrdList();
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((li) => gotOrdList3.removeChild(li));
  sumCart();
}

function cleanCartBtn() {
  const buttonClean = document.querySelector('.empty-cart');
  buttonClean.addEventListener('click', cleanShoppingCart);
}

window.onload = function onload() {
  computerResults();
  cleanCartBtn();
  addStorage();
};
