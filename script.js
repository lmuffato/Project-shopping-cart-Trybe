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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartProducts() {
  const cartList = document.querySelector('ol.cart__items').innerHTML;
  localStorage.setItem('cartProducts', cartList);
}

function fillingCart() {
  const shopList = document.querySelector('ol.cart__items');
  shopList.innerHTML = localStorage.getItem('cartProducts');
}

function cartItemClickListener(event) {
  event.target.remove();
  cartProducts();
 }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `Código: ${sku} | Nome: ${name} | Valor: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const appendProducts = async (data) => {
  const items = document.querySelector('.items');
  data.results.forEach((element) => {
    const result = createProductItemElement(element);
    items.appendChild(result);
  });
};

const computersList = (item) => (new Promise((resolve) => {
    fetch(`${url}${item}`)
    .then((response) => {
      response.json().then((data) => {
        resolve(data);
      });
    });
  })
);

const addToCart = () => {
  const address = 'https://api.mercadolibre.com/items/';
  const productList = document.querySelector('.items');
  productList.addEventListener('click', async (event) => {
    const Codigo = getSkuFromProductItem(event.target.parentNode);
    const endPoint = `${address}${Codigo}`;
    const response = await fetch(endPoint)
      .then((res) => res.json());
    const product = {
      sku: Codigo,
      name: response.title,
      salePrice: response.price,
    };
    const element = createCartItemElement(product);
    const cart = document.querySelector('.cart__items');
    cart.appendChild(element);
    cartProducts();
  });
};

window.onload = function onload() {
  computersList('computador')
  .then((result) => appendProducts(result));
  addToCart();
  /* cartItemsList(); */
  fillingCart();
 }; 