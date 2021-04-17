const cartItemsSelect = (() => document.querySelector('.cart__items'));

const sumPrices = () => {
  const cartItemList = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let total = 0;
  cartItemList.forEach((item) => {
    const split = item.innerText.split('$')[1];
    total += parseFloat(split);
  });
  totalPrice.innerText = total;
};

const updateCartStorage = (id) => {
  if (id) {
      const pos = localStorage.length;
      localStorage.setItem(pos, id);
   } else {
     window.localStorage.clear();
 
     const cartItemList = document.querySelectorAll('.cart__item');
 
     cartItemList.forEach((item, index) => {
       const split = item.innerText.split(' |')[0];
       const itemId = split.split('SKU: ')[1];
       localStorage.setItem(index, itemId);
     });
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  updateCartStorage();
  sumPrices();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadProductList = (data) => {
  data.results.forEach((result) => {
    document.querySelector('.items').appendChild(createProductItemElement(result));
  });
};

const loading = (param) => {
  if (param === 'progress') {
    const loadP = document.createElement('p');
    loadP.className = 'loading';
    loadP.innerHTML = 'loading...'; 
    const container = document.querySelector('.container');
    container.appendChild(loadP);
  } else if (document.querySelector('.loading')) {
    (document.querySelector('.loading').remove());
  }
};

const btnAddCart = async () => {
  const ids = document.querySelectorAll('.item__sku');
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', async () => {
      loading('progress');
      const response = await fetch(`https://api.mercadolibre.com/items/${ids[index].innerText}`);
      const data = await response.json();
      loading('done');
      cartItemsSelect().appendChild(createCartItemElement(data));
      sumPrices();
      updateCartStorage(data.id);
    });
  });
};

const fetchLoad = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  cartItemsSelect().appendChild(createCartItemElement(data));
};

const loadCartStorage = async () => {
  const array = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    array.push(localStorage.getItem(localStorage.key(i)));
  }
  array.forEach((idStorage) => {
    fetchLoad(idStorage);
  });
  sumPrices();
};

const fetchApi = async () => {
  try {
  loading('progress');
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  loadProductList(data);
  btnAddCart();
  loading('done');
  } catch (error) { console.log(error); }
};

const btnEmptyCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    cartItemsSelect().innerText = '';
    sumPrices();
    updateCartStorage();
  });
};

btnEmptyCart();

fetchApi();

if (localStorage.length > 0) {
  loadCartStorage();
}

// window.onload = function onload() {  };
