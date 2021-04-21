const cart = () => document.querySelector('.cart__items');

const updateCart = () => {
  const cartStatus = cart().innerHTML;
  localStorage.setItem('cart', cartStatus);
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
//  checkout();
}

function loadCart() {
  const statusCart = localStorage.getItem('cart');
  const itemOnCart = cart();
  itemOnCart.innerHTML = statusCart;
  itemOnCart.addEventListener('click', (e) => {
    if (e.target.classLIst.contains('cart__item')) {
      cartItemClickListener(e);
    }
  });
//  checkout();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const itemSet = document.querySelector('.items');
  itemSet.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

async function returnAPI(query) {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
   .then((response) => response.json())
     .then((data) => {
       data.results.forEach((item) => {
         const { sku, name, image } = item;
         createProductItemElement({ sku, name, image });
       });
 });
 }

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const fetchId = () => {
  const shoppingCart = cart();
  const buttonAdd = document.querySelector('.items');
    buttonAdd.addEventListener('click', async (e) => {
      const itemId = getSkuFromProductItem(e.target.parentElement);
      const fetchProduct = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
      const itemReturned = await fetchProduct.json();
        const { sku, name, salePrice } = itemReturned;
          shoppingCart.appendChild(createCartItemElement({ sku, name, salePrice }));
          updateCart();
    });
};

window.onload = function onload() {
  returnAPI();
  fetchId();
  loadCart();
};