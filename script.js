const classCartItems = '.cart__item';
// Implementação requisito 5: Some o valor total dos itens do carrinho de compras de forma assíncrona.
const sumPricesItemsCart = async () => {
  const regex = /(\$\d+)(\.\d+)|(\$\d+)/g;
  const [...cartItems] = document.querySelectorAll(classCartItems);
  const sumPrices = cartItems.map((item) => +item.textContent.match(regex)[0]
    .replace(/\$/g, '').trim()).reduce((acc, curr) => acc + curr, 0);
   return +sumPrices.toFixed(2);
};

const showSumPrice = async () => {
  const sumPricesFormat = await sumPricesItemsCart();
  document.querySelector('.total-price')
    .textContent = sumPricesFormat;
};

// End requisito 5

// Implementação requisito 4: Carrinho de compras carregado do localStorage ao iniciar a página
function getItemsCar() {
  const productsCart = [];
  const products = document.querySelectorAll(classCartItems);
  products.forEach((product) => {
    const productInfoCart = {
      text: product.textContent,
      class: product.classList.value,
    };
    productsCart.push(productInfoCart);
  });
  return productsCart;
}

function addLocalStorage() {
  localStorage.setItem('productsCart', JSON.stringify(getItemsCar()));
  showSumPrice();
}

// Implementação requisito 3: Remove item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  if (event.target.classList.contains('cart__item')) {
    event.target.remove();
    addLocalStorage();
  }
}

function loadLocalStorage() {
  const productsCart = JSON.parse(localStorage.getItem('productsCart'));
  if (productsCart) {
    productsCart.forEach((productCart) => {
      const li = document.createElement('li');
      li.className = productCart.class;
      li.textContent = productCart.text;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    });
  }
  showSumPrice();
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

function createProductItemElement({ id: sku, title: name, thumbnail_id: thId }) {
  const section = document.createElement('section');
  const imagem = `https://http2.mlstatic.com/D_NQ_NP_${thId}-O.webp`;
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(imagem));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/// Minhas implementações

// Implementação requisito 1: Criar uma lista de produtos
async function verifiedFetchSearch(url, query) {
  if (url === `https://api.mercadolibre.com/sites/MLB/search?q=${query}`) {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data);
  }
  throw new Error('endpoint not exist');
}

const createProductsList = (listProducts) => {
  listProducts.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
};

async function fetchSearch(query) {
  await verifiedFetchSearch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`,
   query)
    .then((response) => {
      const listProducts = response.results;
      createProductsList(listProducts);
    })
    .catch((err) => err);
}

// Implementação requisito 2: Adicionar o produto ao carrinho de compras

async function verifiedFetchItems(url, itemId) {
  if (url === `https://api.mercadolibre.com/items/${itemId}`) {
    return fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => data);
  }
  throw new Error('endpoint not exist');
}

const createCartItems = ({ id, title, price }) => {
  const obj = {
    sku: id,
    name: title,
    salePrice: price,
  };
  document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
  addLocalStorage();
  sumPricesItemsCart();
  showSumPrice();
};

async function fetchItems(event) {
  if (event.target.classList.contains('item__add')) {
    const itemId = event.target.parentNode.firstChild.textContent;
    await verifiedFetchItems(`https://api.mercadolibre.com/items/${itemId}`, itemId)
    .then((response) => {
      createCartItems(response);
    })
    .catch((err) => err);
  }
}

async function fetchItemsListener() {
  const items = document.querySelector('.items');
  items.addEventListener('click', fetchItems);
}

// Tentativa requisito 5

// async function fetchItemsCart(itemId) {
//   return fetch(`https://api.mercadolibre.com/items/${itemId}`)
//     .then((response) => response.json())
//     .then((data) => data)
//     .catch((err) => err);
// }

// function getIdItemsCart() {
//   const [...cartItems] = document.querySelectorAll('.cart__item');
//   return cartItems.map((cartItem) => cartItem.textContent.match(/(\s[A-Z]\w+)/g)[0].trim());
// }

// const sumPricesItemsCart = async () => {
//   const value = [];
//   const idsItems = getIdItemsCart();
//   idsItems.map(async (id) => {
//     const teste = await fetchItemsCart(id);
//     console.log(teste.price);
//     value.push(teste.price);
//   });
//   console.log(value);
//   return value;
// };

const cleanItemsCart = () => {
  document.querySelector('.empty-cart')
  .addEventListener('click', () => {
    document.querySelector('.total-price').textContent = 0;
    document.querySelectorAll('.cart__item')
      .forEach((cartItem) => {
        cartItem.remove();
      });
    addLocalStorage();
  });
};

window.onload = function onload() { 
  fetchSearch('computador');
  fetchItemsListener();
  loadLocalStorage();
  cleanItemsCart();
};
