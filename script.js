const cartItemsAll = document.querySelectorAll('.cart__items');
const cartItem = document.querySelector('.cart__items');

const sum = () => {
  const liAll = document.querySelectorAll('li');
  let sumAll = 0;
  if (liAll.length === 0) {
    return sumAll;
  }
  const totalDiv = document.querySelector('div.total-price');
  document.querySelector('.cart').appendChild(totalDiv);
  liAll.forEach((e) => {
    const price = parseFloat(e.innerText.split('PRICE: $')[1]);
    sumAll += price;
  });
  console.log(sumAll);
  return sumAll;
};

const totalPrice = async () => {
  const divTotal = await document.querySelector('.total-price');
  const total = sum();
  divTotal.innerHTML = `Total Price: $${total}`;
  return divTotal;
};

const emptyCartAll = () => {
  const getClearAll = document.querySelector('.empty-cart');
  getClearAll.addEventListener('click', () => {
    const liAll = document.querySelectorAll('li');
    liAll.forEach((e) => console.log(e.remove()));
    localStorage.clear();
    totalPrice();
  });
};

const lcStr = () => {
  const txtLi = Object.values(cartItemsAll)
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
  const loading = document.createElement('div');
  loading.classList.add('loading');
  loading.innerHTML = 'loading...';
  document.querySelector('.container').appendChild(loading);
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
  const loading = document.querySelector('.loading');
  document.querySelector('.container').removeChild(loading);
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
  upDateLcStr();
  emptyCartAll();
  totalPrice();
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
      cartItem.appendChild(createCartItemElement(sectionObj));
      totalPrice();
      emptyCartAll();
      lcStr();
    }));
};

const onLoadCart = () => {
  const qtdLi = localStorage.getItem('1');
  if (qtdLi !== null) {
    qtdLi.split('\n').forEach((e) => {
      if (e !== null) {
        const li = document.createElement('li');
        li.innerText = e;
        li.className = 'cart__item';
        cartItem.appendChild(li);
        li.addEventListener('click', cartItemClickListener);
      }
    });
  }
  return null;
};

window.onload = async function onload() {
  await addProdList();
  await addProdInCart();
  await onLoadCart();
  await lcStr();
  await emptyCartAll();
  await totalPrice();
};
