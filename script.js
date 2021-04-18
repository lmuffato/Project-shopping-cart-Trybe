const itemAisle = document.getElementsByClassName('items');
const cartitems = document.getElementsByClassName('cart__items');

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

function cartItemClickListener(event) {
  return event;
}

function createCartItemElement({ sku, name, salePrice }) {
const li = document.createElement('li');
li.className = 'cart__item';
li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
li.addEventListener('click', cartItemClickListener);
return li;
}

async function itemSelector(event) {
  const specHTML = await fetch(`https://api.mercadolibre.com/items/${event}`);
  const productInfo = await specHTML.json();
  const { title, price } = productInfo;
  const infoExport = {
    sku: event,
    name: title,
    salePrice: price,
  };
 cartitems[0].appendChild(createCartItemElement(infoExport));
}

function getSkuFromProductItem(item) {
  const product = item.target.parentElement;
  const id = product.querySelector('span.item__sku').innerText;
  itemSelector(id);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);
  button.addEventListener('click', getSkuFromProductItem);
  return section;
}

async function getInfo() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const info = await response.json();
  const { results } = info;
  results.forEach((item) => {
    const infoExport = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
      itemAisle[0].appendChild(createProductItemElement(infoExport));
    });
}

window.onload = function onload() {
  getInfo();
};
