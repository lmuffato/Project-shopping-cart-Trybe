loclStorage = () => {
  const Cartlist = document.querySelector('.cart__items').innerHTML;
  localStorage.list = Cartlist;
};
loadLocalStorage = () => {
  if (localStorage.list) {
    document.querySelector('.cart__items').innerHTML = localStorage.list;
  }
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.path[1].removeChild(event.path[0]);
  loclStorage();
}

const clear = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    loclStorage();
  },
  );
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  return li;
}
const URL = 'https://api.mercadolibre.com/';
const idUrl = 'https://api.mercadolibre.com/items/';

const adCart = (id) => {
  const endpoint = `${idUrl}${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((response) => {
      const { title, price } = response;
      const li = createCartItemElement({ sku: id, name: title, salePrice: price });
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(li);
    })
    .finally(() => loclStorage());
};

const apiQuery = () => {
  const endpoint = `${URL}sites/MLB/search?q=computador`;
  const load = document.createElement('div');
  load.classList.add('loading');
  load.innerHTML = 'loading...';
  document.querySelector('.container').appendChild(load);
  fetch(endpoint)
    .then(response => response.json())
    .then(item => item.results.forEach((element) => {
      const section = createProductItemElement(element);
      section.lastChild.addEventListener('click', (event) => {
        const idRequest = getSkuFromProductItem(event.target.parentElement);
        addCart(idRequest);
      });
    }))
    .finally(() => document.querySelector('.container').removeChild(load));
};

window.onload = function onload() {
  loadLocalStorage();
  apiQuery();
  clear();
  document.querySelectorAll('.cart__item').forEach(element => element.addEventListener('click', cartItemClickListener));
};