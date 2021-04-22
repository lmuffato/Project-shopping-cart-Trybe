const getPrice = async () => {
  let result = 0;
  const value = [...document.querySelectorAll('.cart__item')];
  const priceCart = value.map((element) => parseFloat(element.innerText.split('$')[1]));
  result = priceCart.reduce((acc, curValue) => acc + curValue, 0);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = `preço total: ${result}`;
};

const saveCart = async () => {
  const cartItems = document.querySelector('ol');
  localStorage.setItem('savedlist', cartItems.innerHTML);
  const totalPrice = document.querySelector('div');
  localStorage.setItem('savedPrice', totalPrice.innerHTML);
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  getPrice();
  saveCart();
}

function createCartItemElement({ id, title, price }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
}

function clearCart() {
const btnClearCart = document.querySelector('.empty-cart');
btnClearCart.addEventListener('click', () => {
  const cartItems = document.querySelector('ol');
  cartItems.innerText = '';
  getPrice();
  saveCart();
});
}

const loadCart = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('savedlist');
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = localStorage.getItem('savedPrice');
};

function loadRemove() {
const liCart = document.querySelectorAll('.cart__item');
liCart.forEach((element) => {
  element.addEventListener('click', cartItemClickListener);
});
}

// API DO ID DO PRODUTO
const productCartPromisse = async (id) => (
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => data)
      );

const fetchProductCart = async (id) => {
  try {
      const productCart = await productCartPromisse(id);
      createCartItemElement(productCart);
  } catch (error) {
    console.log(error);
  }
};

function addCart() {
const btnAddCart = document.querySelectorAll('.item__add');
      btnAddCart.forEach((element) => {
        element.addEventListener('click', async () => {
        try {
          const id = getSkuFromProductItem(element.parentNode);
          await fetchProductCart(id);
          getPrice();
          saveCart();
        } catch (error) {
          console.log(error);
       }            
      });
    });
  }

const productListPromisse = async () => (
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((data) => data)
      );
const fetchProductList = async () => {
  try {
    const data = await productListPromisse();
    const loadProducts = document.querySelector('.loading'); 
    loadProducts.remove();
    data.results.forEach((product) => {
        createProductItemElement(product);
    });
    addCart();
  } catch (error) {
      console.log(error);
    }
  };

window.onload = function onload() {
  addCart();
  getPrice();
  fetchProductList();
  clearCart();
  loadCart();
  loadRemove();
};
