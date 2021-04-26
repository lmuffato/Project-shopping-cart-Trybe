// eslint-disable-next-line sonarjs/no-duplicate-string
const cartItems = document.querySelectorAll('.cart__items');

const lcStr = () => {
  const txtLi = Object.values(cartItems)
    .find((text) => text).innerText;
  localStorage.setItem('1', txtLi);
  return localStorage.getItem('1');
};

const upDateLcStr = async () => {
  await localStorage.clear();
  lcStr();
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

const listProd = async () => {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objProd = await api.json();
  return objProd.results;
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
const addProdList = async () => {
  const prods = await listProd();
  const items1 = document.querySelector('.items');
  prods.forEach((eve) => {
    const sun = createProductItemElement(eve);
    items1.appendChild(sun);
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  return upDateLcStr();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const getIdProd = async (id) => {
  const objId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objReturn = objId.json();
  return objReturn;
};

const addProdInCart = () => {
  document.querySelectorAll('.item__add')
    .forEach((eachProd) => eachProd.addEventListener('click', async (button) => {
      const getSku = getSkuFromProductItem(button.target.parentNode);
      const sectionObj = await getIdProd(getSku);
      const crt = document.querySelector('.cart__items');
      crt.appendChild(createCartItemElement(sectionObj));
      lcStr();
    }));
};

const onLoadCart = () => {
  const qtdLi = localStorage.getItem('1');
  qtdLi.split('\n').forEach((e) => {
    if (e !== '') {
      const li = document.createElement('li');
      li.innerText = e;
      li.className = 'cart__item';
      document.querySelector('.cart__items').appendChild(li);
      li.addEventListener('click', cartItemClickListener);
    }
  });
};

const emptyCartAll = async () => {
  const liAll = await document.querySelectorAll('li');
  const getClearAll = document.querySelector('.empty-cart');
  getClearAll.addEventListener('click', () => {
    liAll.forEach((e) => e.remove());
    localStorage.clear();
  });
};

window.onload = async function onload() {
  await addProdList();
  await addProdInCart();
  await onLoadCart();
  await lcStr();
  emptyCartAll();
};
