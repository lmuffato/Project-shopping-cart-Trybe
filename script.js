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

const addLoad = () => {
  const container = document.querySelector('.container');
  container.appendChild(createCustomElement('div', 'loading', 'Loading'));
};

const removeLoad = () => {
  const load = document.querySelector('.loading');
  load.remove();
};

const cartMenu = () => {
  const cart = document.querySelector('.cart__items');
  return cart;
};

const setStorage = () => {
  // const cartMenu = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cartMenu().outerHTML);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // const cartMenu = document.querySelector('.cart__items');
  cartMenu().removeChild(event.target);
  setStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  setStorage();
  return li;
}

const addProduct = async (skuId) => {
  const mlApi = `https://api.mercadolibre.com/items/${skuId}`;
  fetch(mlApi).then((response) => {
    response.json().then((product) => {
      const cartItem = document.querySelector('ol.cart__items');
      const { id, title, price } = product;
      const objects = { sku: id, name: title, salePrice: price };
      cartItem.appendChild(createCartItemElement(objects));
      setStorage();
    });
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addCartButton = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  section.appendChild(addCartButton);
  addCartButton.addEventListener('click', (event) => {
    const id = getSkuFromProductItem(event.target.parentElement);
    addProduct(id);
  });

  return section;
}

const productsList = async () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  addLoad();
  fetch(endPoint).then((response) => {
    response.json().then((data) => {
      data.results.forEach((element) => {
        const items = document.querySelector('.items');
        const { id, title, thumbnail } = element;
        const objects = { sku: id, name: title, image: thumbnail };
        items.appendChild(createProductItemElement(objects));
      });
    });
    removeLoad();
  });
};

const eraseCart = () => {
  const erasebtn = document.querySelector('.empty-cart');
  erasebtn.addEventListener('click', () => {
    // const cartMenu = document.querySelector('ol.cart__items');
    cartMenu().innerText = '';
  });
};

// const totalPrice = async () => {
//   const cart = document.querySelector('.cart');
//   const sum = document.createElement('div');
//   sum.className = 'total-price';
//   cart.appendChild(sum);

//   const items = document.querySelectorAll('.cart__item');
//   items.forEach((items) => {});
// };

const getStorage = () => {
  // const cartMenu = document.querySelector('.cart__items');
  const get = localStorage.getItem('cartItems');
  if (get) {
    cartMenu().outerHTML = get;
  }
};

window.onload = async function onload() {
  productsList();
  eraseCart();
  getStorage();
  // await totalPrice();
};
