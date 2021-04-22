const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const errorResult = 'Nada encontrado';

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

const sumPrices = (acc, element) => {
  const array = element.innerText.split('$');
  const price = Number(array[1]);
  const total = acc + price;
  return total;
};

const updatePrice = async () => {
  const allItems = document.querySelectorAll('li.cart__item');
  const finalPrice = [...allItems].reduce(sumPrices, 0);
  totalPrice.innerText = finalPrice;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveLocalStorage = () => {
  saveLocalStorage.setItem('price', totalPrice.innerText);
  const allCartItems = cartList.childNodes;
  const saveList = [];
  allCartItems.forEach((li) => {
    saveList.push(li.innerText);
  });
  localStorage.setItem('list', saveList);
};

function cartItemClickListener(target) {
  target.remove();
  updatePrice();
  saveLocalStorage();
}

const uptadeLocalStorage = () => {
  totalPrice.innerText = localStorage.price;
  if (localStorage.list !== undefined) {
    const liElements = localStorage.list.split(',');
    liElements.forEach((e) => {
      const createLi = document.createElement('li');
      createLi.className = 'cart__item';
      createLi.innerText = e;
      createLi.addEventListener('click', cartItemClickListener);
      cartList.appendChild(createLi);
  });
  }
};

function createCartItemElement({ id, title, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const clearList = () => {
  cartList.innerHTML = '';
};

const removeLoading = () => document.querySelector('.loading').remove();

const pcFetch = async () => {
  const pcResponse = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const pcData = await pcResponse.json();
  return pcData;
};

const getPcs = ({ results }) => {
  results.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
};

const idFetch = async (id) => {
  const idResponse = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const idData = await idResponse.json();
  return idData;
};

const clickAllItemAdd = async () => {
  document.querySelectorAll('.item__add').forEach((element) =>
    element.addEventListener('click', async () => {
      try {
        const data = await idFetch(getSkuFromProductItem(element.parentNode));
        cartList.appendChild(createCartItemElement(data));
        updatePrice();
        uptadeLocalStorage();
      } catch (error) {
        return errorResult;
      }
    }));
};

const createData = async () => {
  try {
    const data = await pcFetch();
    getPcs(data);
    removeLoading();
    clickAllItemAdd();
  } catch (error) {
    return errorResult;
  }
};

window.onload = function onload() {
  createData();
  document.querySelector('.empty-cart').addEventListener('click', clearList);
};
