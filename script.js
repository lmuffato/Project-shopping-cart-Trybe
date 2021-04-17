function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const arrayToStorage = [];
const cartNode = () => document.querySelector('.cart__items');

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail_id: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const link = `https://http2.mlstatic.com/D_NQ_NP_${image}-O.webp`;

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(link));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const decreasePrice = (price) => {
  const current = localStorage.getItem('currentPrice');
  const total = parseFloat(current) - price;
  localStorage.setItem('currentPrice', `${parseFloat(total.toFixed(2))}`);
  return parseFloat(total.toFixed(2));
};

const createPricesHTML = (price, callback) => {
  const cartTotal = document.querySelector('.total-price');
  cartTotal.innerText = callback(price);
};

function cartItemClickListener(event) {
  const parent = event.target.parentElement;
  const price = event.target.innerHTML.split('$')[1];
  createPricesHTML(Number(price), decreasePrice);
  parent.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts(produto, general = true) {
  if (general) {
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
      .then((r) => r.json()
        .then((d) => d.results));
  }
  return fetch(`https://api.mercadolibre.com/items/${produto}`)
    .then((r) => r.json());
}

const saveItems = (e) => {
  arrayToStorage.push(e.innerHTML);
  localStorage.setItem('toBuy', JSON.stringify(arrayToStorage));
};

const getItemsFromLocal = () => {
  const items = JSON.parse(localStorage.getItem('toBuy'));
  if (items) {
    items.forEach((element) => {
      const son = document.createElement('li');
      son.className = 'cart__item';
      son.innerHTML = element;
      cartNode().appendChild(son);
      son.addEventListener('click', (event) => cartItemClickListener(event));
    });
  }
};

const sumPrices = (price) => {
  let total = 0;
  const current = localStorage.getItem('currentPrice');
  total = current ? price + parseFloat(current) : total = price;
  localStorage.setItem('currentPrice', `${total}`);
  return parseFloat(total.toFixed(2));
};

const moveToCart = (e) => {
  const esteId = e.target.previousSibling.previousSibling.previousSibling.innerText;
  getProducts(esteId, false)
    .then((r) => {
      const { price: salePrice } = r;
      const li = createCartItemElement(r);
      cartNode().appendChild(li);
      saveItems(li);
      createPricesHTML(salePrice, sumPrices);
    });
};

const addListeners = () => {
  const items = document.querySelectorAll('.item__add');
  items.forEach((item) => {
    item.addEventListener('click', (event) => moveToCart(event));
  });
};

const loadingScreen = async () => {
  const getImage = document.querySelector('.loading');
  const father = document.getElementById('toCenter');
  father.removeChild(getImage);
};

async function criaOsElementos(buscar, general = true) {
  const section = document.querySelector('.items');
  await getProducts(buscar, general)
    .then((r) => r.forEach((product) => section.appendChild(createProductItemElement(product))))
    .then(() => addListeners());
  loadingScreen();
}

const priceDefault = async () => {
  await criaOsElementos('computador', true);
  const toCheck = localStorage.getItem('currentPrice');
  return toCheck ? createPricesHTML(0, sumPrices) : localStorage.setItem('currentPrice', '0');
};

const cleanCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const items = document.querySelectorAll('.cart__item');
    items.forEach((item) => {
      cartNode().removeChild(item);
    });
    localStorage.clear();
    priceDefault();
    const cartTotal = document.querySelector('.total-price');
    cartTotal.innerText = 'Valor total da compra: R$ 0.00';
  });
};

window.onload = function onload() {
  getItemsFromLocal();
  priceDefault();
  cleanCart();
};
