const getCart = () => document.querySelector('.cart__items');

function boardKeys({ id, title, thumbnail }) {
  return {
    sku: id,
    name: title,
    image: thumbnail,
  };
}

function cartKeys({ id, title, price }) {
  return {
    sku: id,
    name: title,
    salePrice: price,
  };  
}

const sumPrices = () => {
  const getCartItems = document.querySelectorAll('.cart__item');
  const getTotalPrice = document.querySelector('.total-price');
  let total = 0;
  getCartItems.forEach((iten) => {
    const split = iten.innerText.split('$')[1];
    total += parseFloat(split);
  });
  getTotalPrice.innerText = total;
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

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function toStorage() {
  const content = getCart().innerHTML;
  window.localStorage.setItem('cart', content);
}

function cartItemClickListener(event) {
  event.target.remove();
  toStorage();
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const productId = event.target.parentNode.firstChild.innerText;
  const request = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((data) => data.json())
    .then((data) => {
      const itemCart = createCartItemElement(cartKeys(data));
      getCart().appendChild(itemCart);
      sumPrices();
    });
  toStorage();
 
  return request;
};

const container = () => document.querySelector('.container');
const loadingText = document.createElement('h1');
loadingText.innerText = 'loading...';
loadingText.classList.add('loading');

const getDataProducts = () => {
  container().appendChild(loadingText);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((data) => data.json())
    .then((data) => data.results)
    .then((results) => {
      results.forEach((iten) => {
        const productInfo = boardKeys(iten);
        const getBoard = document.querySelector('.items');
        const eachProduct = createProductItemElement(productInfo);
        eachProduct.querySelector('.item__add').addEventListener('click', addToCart);
        getBoard.appendChild(eachProduct);
      });
    })
    .then(() => {
      container().removeChild(loadingText);
    });
};

function loadStorage() {
  const storedCart = localStorage.getItem('cart');
  const updateCart = getCart();
  updateCart.innerHTML = storedCart;
  updateCart.addEventListener('click', (li) => {
    if (li.target.classList.contains('cart__item')) {
      cartItemClickListener(li);
    }
  });
  sumPrices();
}
// const setClick = document.querySelectorAll('cart__item');
// setClick.forEach((li) => li.addEventListener('click', cartItemClickListener));

function getEmpty() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => item.remove());
  sumPrices();
  toStorage();
}

function emptyButton() {
const button = document.querySelector('.empty-cart');
button.addEventListener('click', getEmpty);
}

window.onload = function onload() {
  getDataProducts();
  loadStorage();
  emptyButton();
  // window.localStorage.removeItem('cart');
};

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/split
