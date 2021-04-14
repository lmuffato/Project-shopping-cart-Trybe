const API = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const itemAPI = 'https://api.mercadolibre.com/items/';
const idCarts = '.cart__items';

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

const getItemById = async (event) => {
  const cart = document.querySelector(idCarts);
  const sku = event.target.parentNode.querySelector('.item__sku').innerText;
  const el = getAPIById(sku);
  await el.then((data) => {
    const newEl = createCartItemElement(data);
    cart.appendChild(newEl);
  });
  saveCart();
};

const addEventListenerButton = () => {
  const listItens = document.querySelectorAll('.item');
  listItens.forEach((item) => {
    item.querySelector('button').addEventListener('click', getItemById);
  });
};

  window.onload = async function onload() {
    const results = await getProductsPromise();
    const items = document.querySelector('.items');
    results.forEach((element) => {
      items.appendChild(createProductItemElement(element));
    });
    loadCart();
    addEventListenerButton();
  };
