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
  const parent = event.target.parentNode;
  parent.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProduct = (product) => (
  new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
      .then((response) => {
        response.json().then((data) => {
          resolve(data);
        });
      });
  })
);

const appendItems = async (product) => {
  const data = await fetchProduct(product);
  const items = await document.querySelector('.items');
  data.results.forEach((element) => {
    const result = createProductItemElement(element);
    items.appendChild(result);
  });
};

const fetchId = (itemId) => (
  new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((result) => {
      result.json().then((data) => {
        resolve(data);
      });
    });
  })
);

const appendToCart = (data) => {
  const cart = createCartItemElement(data);
  document.querySelector('.cart__items').appendChild(cart);
};

const addToCart = async (product, target) => {
  const id = target.previousSibling.previousSibling.previousSibling.innerText;
  const cartPrice = document.querySelector('.cart-price');
  const currentPrice = parseInt(cartPrice.innerText, 10);
  const idData = await fetchId(id);
  const newPrice = currentPrice + idData.price;
  cartPrice.innerText = newPrice;
  appendToCart(idData);  
};

const addToCartEvent = (product) => {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.addEventListener('click', (event) => (
    event.target.classList.contains('item__add') ? addToCart(product, event.target) : undefined
  ));
};

window.onload = function onload() {
  document.querySelector('.cart-price').innerText = 0;
  appendItems('computador');
  addToCartEvent('computador');
 };