const API = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const itemAPI = 'https://api.mercadolibre.com/items/';

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
  console.log(event.target);
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

const getItemById = (event) => {
  const cart = document.querySelector('.cart__items');
  const sku = event.target.parentNode.querySelector('.item__sku').innerText;
  const el = getAPIById(sku);
  el.then((data) => {
    const newEl = createCartItemElement(data);
    cart.appendChild(newEl);
  });
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
    addEventListenerButton();
  };
