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

// const totalPrice = async () => {
//   const items = document.getElementsByClassName('cart__item');
//   console.log(items);
//   console.log(items[0]);
//   if (items !== undefined) {
//   const parcialPrice = await items.reduce((acc, item) => {
//     const itemTXT = item.innerText;
//     const price = itemTXT.split('$')[1];
//     console.log(price);
//     return acc + price;
//      }, 0);
//   const p = document.createElement('p');
//   p.innerText = parcialPrice;
//   p.className = 'total-price';
//   const parentToAdd = document.querySelector('.cart');
//   parentToAdd.appendChild(p);
//   }
// };

const cartItemClickListener = (event) => {
  // event.target.remove(); Aprendido no plantao (nao lembro quem estava usando)
  const e = event.target;
  const eParent = e.parentNode;
  eParent.removeChild(e);
  // totalPrice();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function tratarJSON(url) {
  return fetch(url)
    .then((data) => data.json())
    .then((data) => data.results);
}

async function getProductsInfo() {
  const pc = 'computador';
  const productInfo = await
  tratarJSON(`https://api.mercadolibre.com/sites/MLB/search?q=$${pc}`)
    .then((data) => data);
  return productInfo;
}

const getInfoToCartList = async (id) => {
  const itemInfo = await
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((data) => data.json())
  .then((data) => data);
  return itemInfo;
};

async function creatingItems() {
  const sectionItems = document.querySelector('.items');
  const array = await getProductsInfo();
  array.forEach((item) => {
    const newItem = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
      };
    sectionItems.appendChild(createProductItemElement(newItem));
  });
}

const addToCartList2 = async (idItem) => {
  const cartList = document.querySelector('.cart__items');
  const itemToAddInCart = await getInfoToCartList(idItem);
  // console.log(itemToAddInCart);
  const itemToAdd = { sku: itemToAddInCart.id,
    name: itemToAddInCart.title,
    salePrice: itemToAddInCart.price };
  cartList.appendChild(createCartItemElement(itemToAdd));
  // totalPrice();
};

const addToCartList = (event) => {
  const e = event.target;
  const eParent = e.parentNode;
  const id = eParent.querySelector('.item__sku').innerText;
  return addToCartList2(id);
};

const createEventListenerToButtons = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', addToCartList);
  });
};

const emptyCart = async () => {
  const cartItemsList = document.querySelector('.cart__items');
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => {
    cartItemsList.removeChild(item);
  });
};
const emptyCartEventListner = () => {
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', emptyCart);
};

window.onload = function onload() { 
  creatingItems()
    .then(() => createEventListenerToButtons())
    .then(() => emptyCartEventListner());
};