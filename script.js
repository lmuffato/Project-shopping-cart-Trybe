// const { create } = require("eslint/lib/rules/*");

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getProductDataList() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
        resolve(data.results);
        })
        .catch((erro) => {
          reject(erro);
        });
    });
  });
}

const createLoadingText = () => {
  const section = document.querySelector('.items');
  const loading = document.createElement('p');
  section.appendChild(loading);
  loading.className = 'loading';
  loading.innerText = 'loading...';
};

// const totalPrice = async () => {
//   const item = document.querySelectorAll('.cart__item');
//   console.log(item)
//   await item.filter((element) => console.log(element));
// };
// console.log(totalPrice());

// const totalPriceText = (price) => {
//   const parentNodeTotal = document.querySelector('.cart');
//   const parentTotal = document.createElement('div');
//   const total = document.createElement('p');
//   parentNodeTotal.appendChild(parentTotal);
//   parentTotal.className = 'total-price';
//   parentTotal.appendChild(total);
//   total.innerText = `Preço total: $${price}`;
// };

const createProductList = (data) => {
  const loading = document.querySelector('.loading');
  loading.remove();
  const appendItens = data.forEach((element) => {
    const createItens = document.querySelectorAll('.items')[0];
    return createItens.appendChild(createProductItemElement(element));
  });
  // totalPriceText();
  return appendItens;
};

const items = () => document.querySelectorAll('.cart__items');

const setStorage = () => {
  items().forEach((element) => {
    localStorage.setItem('cartItems', element.innerHTML);
  });
};

function cartItemClickListener({ target }) {
  target.remove();
  setStorage();
}

const emptyCart = () => {
  const getClass = document.querySelectorAll('.cart__item');
  getClass.forEach((element) => element.remove());
};

const eventEmptyCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);
};

const removeItens = () => {
  items().forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
    // price
  });
};

const loadStorage = () => {
  items().forEach((item) => {
    const itemStorage = item;
    itemStorage.innerHTML = localStorage.getItem('cartItems');
  });
  removeItens();
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductDataFromForPurchase = (productId) => new Promise((resolve, reject) => {
  const ol = document.querySelector('.cart__items');

  fetch(`https://api.mercadolibre.com/items/${productId}`)
  .then((response) => {
    response.json()
      .then((data) => {
        resolve(data);
        ol.appendChild(createCartItemElement(data));
        setStorage();
      })
      .catch((erro) => {
        reject(erro);
      });
  });
});

function getSkuFromProductItem(it) {
  return it.querySelector('span.item__sku').innerText;
}

const getDataId = (e) => {
  const event = e.target.parentNode;
  const id = getSkuFromProductItem(event);
  getProductDataFromForPurchase(id);
};

const clickButton = () => {
  document.querySelector('.items').addEventListener('click', getDataId);
};

const functionsAsync = async () => {
  try {
    createProductList(await getProductDataList());
    clickButton();
    await eventEmptyCart();
    await loadStorage();
  } catch (erro) {
    throw new Error('Deu algum bizil');
  }
};

window.onload = function onload() { 
  functionsAsync();
  createLoadingText();
};
