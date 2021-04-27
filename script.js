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

const textoLoading = () => {
  const loadingText = createCustomElement('span', 'loading', 'loading...');
  document.querySelector('.items').appendChild(loadingText);
};

const verifiedFetch = async (url) => {
  textoLoading();
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
      .then((r) => r.json())
      .then((r) => (r));
  }
  throw new Error('endpoint não existe');
};

const btnClear = document.querySelector('.empty-cart');
btnClear.addEventListener('click', () => { 
  localStorage.clear();
  const arrayOfItens = document.querySelectorAll('.cart__item');
  arrayOfItens.forEach((element) => element.remove());
});

// const arrayOfValues = [];

// const createTotalValue = async (price) => {
//   const totalPrice = await document.querySelector('.total-price');
//   if (!localStorage.price) { totalPrice.innerText += price; } else { totalPrice.innerText = price; }
//   localStorage.price = totalPrice.innerText;
//   return totalPrice;
// };
const totalPrice = document.querySelector('.total-price');
const cartItem0 = document.querySelector('.cart__items');
// utilizei do repositório do Renzo para as 2 funções seguintes. repositório : https://github.com/tryber/sd-010-a-project-shopping-cart/pull/58/commits/55251dbd95d243b83b26ba894ab6ce2560c2e543
const sumPrices = (acc, element) => {
  const arr = element.innerText.split('$');
  const price = Number(arr[1]);
  const total = acc + price;
  return total;
};

const updatePrice = async () => {
  const liArray = document.querySelectorAll('.cart__item');
  // console.log(liArray);
  const price = [...liArray].reduce(sumPrices, 0);
  totalPrice.innerText = price;
  localStorage.totalPrice = totalPrice.innerText;
};

function cartItemClickListener(event) {
  // arrayOfValues.pop();
  event.target.remove(); // Descobri o remove() na intuição :O ... Nem acredito ,-,
  localStorage.cartItens = cartItem0.innerHTML;
  updatePrice();
  // let total = 0;
  // arrayOfValues.forEach((element) => { total += element; });
  // createTotalValue(total);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  // arrayOfValues.push(salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const asd = async (selectedId) => {
  const cartItem = document.querySelector('.cart__items');
  const product = await fetch(`https://api.mercadolibre.com/items/${selectedId}`)
    .then((r) => r.json())
    .then((r) => r);
  cartItem.appendChild(createCartItemElement(product));
  localStorage.cartItens = cartItem.innerHTML;
  // let total = 0;
  // arrayOfValues.forEach((element) => { total += element; });
  // createTotalValue(total);
  // console.log(localStorage.cartItens);
};

const sla = async () => {
  const a = document.querySelectorAll('.item__add');
  // let selectedId;
  a.forEach((element) => element.addEventListener('click', (e) => {
    const id = e.target.previousElementSibling.previousElementSibling
    .previousElementSibling.innerText;
    // selectedId = id;
    asd(id);
    updatePrice();
  }));
};

const execute = async () => {
  const feti = await verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const items = document.querySelector('.items');
  items.firstElementChild.remove();
  const result = feti.results;
  result.forEach((element) => items.appendChild(createProductItemElement(element)));
  sla();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
const chamaStorage = () => {
if (localStorage.cartItens) cartItem0.innerHTML = localStorage.cartItens;
if (localStorage.price) document.querySelector('.total-price').innerText = localStorage.price;
  updatePrice();
};

window.onload = function onload() {
  execute();
  chamaStorage();
};
