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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const verifiedFetch = async (url) => {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
      .then((r) => r.json())
      .then((r) => (r));
  }
  throw new Error('endpoint não existe');
};

const arrayOfValues = [];

function cartItemClickListener(event) {
  arrayOfValues.pop();
  event.target.remove(); // Descobri o remove() na intuição :O ... Nem acredito ,-,
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  arrayOfValues.push(salePrice);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // console.log(arrayOfValues);
  return li;
}

const createTotalValue = (price) => {
  const limpa = document.querySelectorAll('.total-price');
  limpa.forEach((element) => element.remove());
  const totalPrice = document.createElement('div');
  totalPrice.className = 'total-price';
  totalPrice.innerText = `Preço total: ${price.toFixed(2)}`;
  return totalPrice;
};

const cartItem0 = document.querySelector('.cart__items');
const asd = async (selectedId) => {
  const cartItem = document.querySelector('.cart__items');
  const product = await fetch(`https://api.mercadolibre.com/items/${selectedId}`)
    .then((r) => r.json())
    .then((r) => r);
    cartItem.appendChild(createCartItemElement(product));
  localStorage.cartItens = cartItem.innerHTML;
  let total = 0;
  arrayOfValues.forEach((element) => { total += element; });
  cartItem.appendChild(createTotalValue(total));
  // console.log(test);
};

const sla = async () => {
  const a = document.querySelectorAll('.item__add');
  let selectedId;
  a.forEach((element) => element.addEventListener('click', (e) => {
    const id = e.target.previousElementSibling.previousElementSibling
    .previousElementSibling.innerText;
    selectedId = id;
    asd(selectedId);
  }));
};

const execute = async () => {
  const feti = await verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const result = feti.results;
  const items = document.querySelector('.items'); 
  result.forEach((element) => items.appendChild(createProductItemElement(element)));
  sla();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
localStorage.clear();
window.onload = function onload() {
  execute();
  // cartItem0.innerHTML = localStorage.cartItens;
};