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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const productId = event.target.parentNode.firstChild.innerText;
  const request = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((data) => data.json())
    .then((data) => {
      const itemCart = createCartItemElement(cartKeys(data));
      getCart().appendChild(itemCart);
    });

  toStorage();
  return request;
};

const getDataProducts = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((data) => data.json())
    .then((data) => data.results)
    .then((results) => {
      results.forEach((iten) => {
        const productInfo = boardKeys(iten);
        const getBoard = document.querySelector('.items');
        const eachProduct = createProductItemElement(productInfo);
        eachProduct.querySelector('.item__add').addEventListener('click', addToCart);
        getBoard.appendChild(eachProduct);
      }); // adicionar aqui a funçao de carregar o storage
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
}
// const setClick = document.querySelectorAll('cart__item');
// setClick.forEach((li) => li.addEventListener('click', cartItemClickListener));

window.onload = function onload() {
  getDataProducts('computador');
  loadStorage();
  // window.localStorage.removeItem('cart');
};
