const cartItems = '.cart__items';

function savingItems() {
  const cartLi = document.querySelector(cartItems);
  localStorage.setItem('items', cartLi.innerHTML);
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

function cartItemClickListener(event) {
  const click = event.target;
  click.remove();
}

// funções de fetch, 1 e 2 requisito

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector('ol.cart__items').appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createCartItem = async (item) => {
  const getProduct = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const response = await getProduct.json();
  return response;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async () => {
    const gettingChild = section.firstChild.innerHTML;
    const returnFunction = await createCartItem(gettingChild);
    document.querySelector(cartItems).appendChild(createCartItemElement(returnFunction));
  });
  return section;
}

async function fetchProducts() {
  const getProduct = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const result = await getProduct.json();
    const data = await result.results;
    data.forEach((value) => {
      const product = { sku: value.id, name: value.title, image: value.thumbnail };
      document.querySelector('.items').appendChild(createProductItemElement(product));
    // createCartItem(receivedItems);
  });
}

// referência Patrick e Rogério, turma A. Me deu noção de como fazer o botão de maneira pragmática.
const clearingCart = () => {
  const getCart = document.querySelector('.empty-cart');
  getCart.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    savingItems();
  });
};
window.onload = function onload() {
 clearingCart();
 fetchProducts();
};
