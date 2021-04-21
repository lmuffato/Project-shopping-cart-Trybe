const cart = () => document.querySelector('.cart__items');

const updateCart = () => {
  const cartStatus = cart().innerHTML;
  localStorage.setItem('cart', cartStatus);
};

const fetchCart = () => {
  localStorage.getItem('cart');
};

const checkout = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let sumItems = 0;
  cartItem.forEach((item) => {
    const split = item.innerText.split('$')[1];
      sumItems += parseFloat(split);
  });
  total.innerText = sumItems;
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

function cartItemClickListener(event) {
  event.target.remove();
  updateCart();
  checkout();
}

function loadCart() {
  const statusCart = localStorage.getItem('cart');
  const itemOnCart = cart();
  itemOnCart.innerHTML = statusCart;
  itemOnCart.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart__item')) {
      cartItemClickListener(e);
    }
  });
 checkout();
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const itemSet = document.querySelector('.items');
  itemSet.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

async function returnAPI() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
   .then((response) => response.json())
     .then((data) => {
       data.results.forEach((item) => {
         const { id, title, thumbnail } = item;
         console.log(item);
         createProductItemElement({ id, title, thumbnail });
       });
 });
 }

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  return li;
}

const fetchId = () => {
  const shoppingCart = cart();
  const buttonAdd = document.querySelector('.items');
    buttonAdd.addEventListener('click', async (e) => {
      const itemId = getSkuFromProductItem(e.target.parentElement);
      const fetchProduct = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
      const itemReturned = await fetchProduct.json();
        const { id, title, price } = itemReturned;
          shoppingCart.appendChild(createCartItemElement({ id, title, price }));
          updateCart();
          checkout();
    });
};

function clearButton() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', function () {
  const cartStatus = document.querySelectorAll('.cart__item');
  cartStatus.forEach((product) => product.remove());
  updateCart();
  checkout();
  });
}

window.onload = function onload() {
  returnAPI();
  fetchId();
  loadCart();
  fetchCart();
  clearButton();
};