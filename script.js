const API = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const itemAPI = 'https://api.mercadolibre.com/items/';
const idCarts = '.cart__items';

const loading = () => {
  const elLoading = document.createElement('p');
  elLoading.className = 'loading';
  elLoading.innerHTML = 'Loading...';
  document.body.appendChild(elLoading);
};

const stopLoading = () => {
  document.querySelector('.loading').remove();
};

const saveCart = () => {
  const items = document.querySelector(idCarts).innerHTML;
  localStorage.setItem('cart', items);
};

const loadCart = () => {
  const items = document.querySelector(idCarts);
  const loadedItems = localStorage.getItem('cart');
  items.innerHTML = loadedItems;
};

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

const getProductsPromise = () => new Promise((resolve, reject) => {
  if (`${API}computador`) {
    fetch(`${API}computador`)
      .then((response) => {
        response.json().then((data) => {
          resolve(data.results);
        });
      });
  } else {
    console.log('erro');
    reject(new Error('error'));
  }
});

const getAPIById = (sku) => new Promise((resolve, reject) => {
  try {
    fetch(`${itemAPI}${sku}`)
    .then((response) => {
      response.json()
        .then((data) => {
          resolve(data);
        });
    });
  } catch (error) {
    reject(error);
  }
});

const sumAllItensCart = () => {
  let sum = 0;
  const it = document.querySelectorAll('.cart__item');
  [...it].forEach((el) => {
    sum += parseFloat(el.innerText.substring(el.innerText.indexOf('PRICE') + 8));
  });
  return sum;
};

const createTotalPrice = () => {
  const total = document.querySelector('.total-price');
  total.innerHTML = (Math.round(sumAllItensCart() * 100) / 100);
};

function cartItemClickListener(event) {
  event.target.remove();
  createTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemById = async (event) => {
  const cart = document.querySelector(idCarts);
  const sku = event.target.parentNode.querySelector('.item__sku').innerText;
  const el = getAPIById(sku);
  await el.then((data) => {
    const newEl = createCartItemElement(data);
    cart.appendChild(newEl);
  });
  createTotalPrice();
  saveCart();
};

const addEventListenerButton = () => {
  const listItens = document.querySelectorAll('.item');
  listItens.forEach((item) => {
    item.querySelector('button').addEventListener('click', getItemById);
  });
};

const clearCart = () => {
  const items = document.querySelector(idCarts);
  items.innerHTML = '';
  createTotalPrice();
  saveCart();
};

window.onload = async function onload() {
  loading();
  const results = await getProductsPromise();
  const items = document.querySelector('.items');
  const emptyCart = document.querySelector('.empty-cart');
  results.forEach((element) => {
    items.appendChild(createProductItemElement(element));
  });
  stopLoading();
  loadCart();
  addEventListenerButton();
  createTotalPrice();
  emptyCart.addEventListener('click', clearCart);
};
