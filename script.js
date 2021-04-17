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

const createProductList = (data) => {
  const appendItens = data.forEach((element) => {
    const createItens = document.querySelectorAll('.items')[0];
    return createItens.appendChild(createProductItemElement(element));
  });
  return appendItens;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.preventDefault();
  const itemCart = document.querySelector('.cart__item');
  itemCart.remove();  
}

const emptyCart = () => {
  const getClass = document.querySelectorAll('.cart__item');
  getClass.forEach((element) => element.remove());
};

const eventEmptyCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);
};

const totalPrice = async (price) => {
  const parentNodeTotal = document.querySelector('.cart');
  const parentTotal = document.createElement('div');
  const total = document.createElement('p');
  parentNodeTotal.appendChild(parentTotal);
  parentTotal.className = 'total-price';
  parentTotal.appendChild(total);
  total.innerText = `${price + price}`;
};

  function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  totalPrice(price);
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
      })
      .catch((erro) => {
        reject(erro);
      });
  });
});

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
  } catch (erro) {
    throw new Error('Deu algum bizil');
  }
};

window.onload = function onload() { 
  functionsAsync();
};