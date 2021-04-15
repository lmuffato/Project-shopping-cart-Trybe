window.onload = function onload() { 
  addProductsOnList();
};

async function addProductsOnList() {
  const itemsListSection = document.querySelector('.items');
  const apiRequestedItens = await fetch("https://api.mercadolibre.com/sites/MLB/search?q=$computador")
    .then((response) => response.json())
      .then((data) => data.results);

  await apiRequestedItens.forEach(({id, title, thumbnail}) =>
    itemsListSection.appendChild(createProductItemElement({sku: id, name: title, image: thumbnail})));
  
  const listedProductsButtons = document.querySelectorAll('.item button');
  listedProductsButtons.forEach(button => button.addEventListener('click', (e) => productListItemClickListener(e)));
}

async function addProducstOnCart({sku, name, salePrice}) {
  const cartItemsList = document.querySelector('.cart__items');
  cartItemsList.appendChild(createCartItemElement({sku, name, salePrice}));
  const productsInTheCart = document.querySelectorAll('.cart__item');
  productsInTheCart.forEach(product =>
    product.addEventListener('click',
      (e) => cartItemClickListener(e)));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function productListItemClickListener(event) {
  const cardItemProduct = event.target.parentElement;
  const cardItemProductId = cardItemProduct.childNodes[0].innerText;
  
  const {price, id, title} = await fetch(`https://api.mercadolibre.com/items/${cardItemProductId}`)
    .then((res) => res.json())
      .then((item) => item);
  
  addProducstOnCart({sku: id, name: title, salePrice:price});
}

async function cartItemClickListener(event) {
  const itemToBeRemoved = event.target;
  document.querySelector('.cart__items').removeChild(itemToBeRemoved);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
