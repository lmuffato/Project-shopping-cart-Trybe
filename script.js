function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// const getItemInfo = async (btn) => {
//   const itemInfo = btn.parentElement();
//   console.log(itemInfo);
// };

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  // if (element === 'button') {
  //   e.addEventListener('click', getItemInfo(e));
  // }
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// // // const btnAddToCartEvent = async () => {
// // //   const btnAddToCart = await document.querySelectorAll('.item_add');
// // //   btnAddToCart.forEach((btn) => {
// // //     btn.addEventListener('click', getItemInfo(btn));
// // //   });
// // // };

async function tratarJSON(url) {
  return fetch(url)
    .then((data) => data.json())
    .then((data) => data.results);
}

async function getProductsInfo() {
  const productInfo = await 
  tratarJSON('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((data) => data);
  return productInfo;
}

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
  const array = await getProductsInfo();
  const itemToAddInCart = array.find((item) => item.id === idItem);
  const itemToAdd = { sku: itemToAddInCart.id,
    name: itemToAddInCart.title,
    salePrice: itemToAddInCart.price };
  cartList.appendChild(createCartItemElement(itemToAdd));
};

const addToCartList = () => {
  const e = event.target;
  const eParent = e.parentNode;
  const id = eParent.querySelector('.item__sku').innerText;
  console.log(id);
  return addToCartList2(id);
};

const createEventListenerToButtons = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', addToCartList);
  });
};

window.onload = function onload() { 
  creatingItems()
    .then(() => createEventListenerToButtons());
};