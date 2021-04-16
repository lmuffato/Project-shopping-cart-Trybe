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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  const parent = event.target.parentElement;
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
    });
  }
};

const sumPrices = (price) => {
  let total = 0;
  const current = localStorage.getItem('currentPrice');
  total = current ? price + parseFloat(current) : total = price;
  localStorage.setItem('currentPrice', `${total}`);
  return total.toFixed(2);
};

const createPricesHTML = (price) => {
  const cartTotal = document.querySelector('.total-price');
  cartTotal.innerText = `Valor total da compra: R$ ${(sumPrices(price))}`;
};

const moveToCart = (e) => {
  const esteId = e.target.previousSibling.previousSibling.previousSibling.innerText;
  getProducts(esteId, false)
    .then((r) => {
      const { price: salePrice } = r;
      const li = createCartItemElement(r);
      cartNode().appendChild(li);
      saveItems(li);
      createPricesHTML(salePrice);
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
  const father = document.querySelector('#toCenter');
  father.removeChild(getImage);
};

async function criaOsElementos(buscar, general = true, classe) {
  const section = document.querySelector(`.${classe}`);
  await getProducts(buscar, general)
    .then((r) => r.forEach((product) => section.appendChild(createProductItemElement(product))))
    .then(() => addListeners());
  loadingScreen();
}

const priceDefault = async () => {
  await criaOsElementos();
  const toCheck = localStorage.getItem('currentPrice');
  return toCheck ? createPricesHTML(0) : localStorage.setItem('currentPrice', '0');
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
    cartTotal.innerText = 'Valor total da compra: R$ 0';
  });
};

window.onload = function onload() {
  criaOsElementos('computador', true, 'items');
  getItemsFromLocal();
  priceDefault();
  cleanCart();
};
