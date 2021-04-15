function getCartContainer() {
  return document.querySelector('.cart__items');
}

function getCartItems() {
  return document.querySelectorAll('.cart__item');
}

function saveCart() {
  const cartContainer = getCartContainer().innerHTML;
  localStorage.setItem('cart', cartContainer);
}

function showTotal() {
  const cartItems = getCartItems();
  let result = 0;
  cartItems.forEach((item) => {
    const priceIndex = item.innerHTML.search('PRICE');
    const price = item.innerHTML.slice(priceIndex + 8);
    result += Number(price);
  });
  return result;
}

async function showTotalPrice() {
  const result = document.querySelector('.total-price');
  result.innerHTML = showTotal();
}

function updateCart() {
  saveCart();
  showTotalPrice();
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
  event.target.remove();
  updateCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProducts() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => {
        response.json().then((data) => resolve(data));
      });
  });
}

function reloadCart() {
  const cartContainer = getCartContainer();
  cartContainer.innerHTML = localStorage.getItem('cart');
  const cartItems = getCartItems();
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

function appendProducts(data) {
  data.results.forEach((result) => {
    const container = document.querySelector('.items');
    container.appendChild(createProductItemElement(result));
  });
}

function appendToCart(data) {
  const buttons = document.querySelectorAll('.item button');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const cartContainer = getCartContainer();
      const addToCart = createCartItemElement(data[index]);
      cartContainer.appendChild(addToCart);
      updateCart();
    });
  });
}

function clearCart() {
  const clearCartButton = document.querySelector('.empty-cart');
  clearCartButton.addEventListener('click', () => {
    getCartContainer().innerHTML = '';
    updateCart();
  });
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

async function createProductsList() {
  try {
    const data = await getProducts();
    await removeLoading();
    await appendProducts(data);
    await appendToCart(data.results);
    await showTotalPrice();
  } catch (error) {
    console.log('Falha na matrix');
  }
}

window.onload = function onload() {
  createProductsList();
  reloadCart();
  clearCart();
};
