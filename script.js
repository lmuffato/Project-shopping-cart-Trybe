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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const element = event.target;
  const elementItem = element.id;
  element.remove();
  localStorage.removeItem(`id-${elementItem}`);
  localStorage.removeItem(`name-${elementItem}`);
  localStorage.removeItem(`salePrice-${elementItem}`);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  let totalItems = 0;
  if (localStorage.getItem('totalCartItems')) {
    totalItems = parseInt(localStorage.getItem('totalCartItems'), 10);
  }
  localStorage.setItem(`id-${(totalItems + 1)}`, sku);
  localStorage.setItem(`name-${(totalItems + 1)}`, name);
  localStorage.setItem(`salePrice-${(totalItems + 1)}`, salePrice);
  li.id = `${totalItems + 1}`;
  return li;
}

function onloadCreateCartItemElement() {
  for (let index = 1; index <= parseInt(localStorage.getItem('totalCartItems'), 10); index += 1) {
    if (localStorage.getItem(`id-${index}`)) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      const sku = localStorage.getItem(`id-${index}`);
      const itemName = localStorage.getItem(`name-${index}`);
      const itemPrice = localStorage.getItem(`salePrice-${index}`);
      li.id = `${index}`;
      li.innerText = `SKU: ${sku} | NAME: ${itemName} | PRICE: $${itemPrice}`;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    }
  }
}

const getProducts = async () => {
  const item = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

async function fetchProduct() {
  const items = await getProducts();
  items.forEach((item) => {
    const paramObj = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const product = createProductItemElement(paramObj);
    document.querySelector('.items').appendChild(product);
  });
}

const getItem = (itemId) => fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json());

async function appendShoppingCart(event) {
  const parent = event.target.parentNode;
  const myItem = parent.querySelector('span.item__sku').innerText;
  const myJson = await getItem(myItem);
  const paramObj = {
    sku: myJson.id,
    name: myJson.title,
    salePrice: myJson.price,
  };
  const cartElement = createCartItemElement(paramObj);
  document.querySelector('.cart__items').appendChild(cartElement);
  if (localStorage.getItem('totalCartItems')) {
    localStorage.totalCartItems = parseInt(localStorage.getItem('totalCartItems'), 10) + 1;
  } else {
    localStorage.setItem('totalCartItems', 1);
  }
}

const addListener = () => {
  document.querySelector('.items').addEventListener('click', appendShoppingCart);
};

window.onload = function onload() {
  fetchProduct();
  addListener();
  onloadCreateCartItemElement();
};
