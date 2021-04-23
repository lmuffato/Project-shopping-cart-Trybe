// necessária a criação dessas contantes para o lint!
const cartItem = '.cart__item';
const cartItems = '.cart__items';

const saveCart = () => {
  const cart = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('cart', cart);
};

// https://trybecourse.slack.com/archives/C01A9A2N93R/p1608237982190300

const totalCheckout = () => {
  const cartPc = document.querySelectorAll(cartItem);
  let amount = 0;
  cartPc.forEach((item) => {
  amount += parseFloat(item.textContent.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = parseFloat(amount.toFixed(2));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource.replace('I.jpg', 'O.jpg');
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const { parentElement } = event.target;
  parentElement.removeChild(event.target);
  totalCheckout();
  saveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const searchComputers = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
.then((response) => response.json())
.then((data) => data.results)
.then((data) => data.forEach((pc) => {
  const section = document.querySelector('.items');
  section.appendChild(createProductItemElement(pc));
  }));

// const syncTest = async () => {
//   const async1 = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
//   const async2 = await async1.json();
//   console.log(async2.results);
//   // console.log(sync3);
// };
const searchPcById = (mlb) => fetch(`https://api.mercadolibre.com/items/${mlb}`)
.then((response) => response.json())
.then(({ id, title, price }) => ({ id, title, price }));
// requisito realizado com o auxílio de rafael medeiros, guilherme dornelles e gabriel pereira - turma 10 tribo A
const addButton = () => {
const buttons = document.querySelectorAll('.item button');
  buttons.forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const cartItens = document.querySelector(cartItems);
        const mlb = getSkuFromProductItem(event.target.parentElement);
        const obj = await searchPcById(mlb);
        const getPc = createCartItemElement(obj);
        cartItens.appendChild(getPc);
        saveCart();
        totalCheckout();
      });
    });
};
// https://trybecourse.slack.com/archives/C01A9A2N93R/p1608237982190300
const loadCart = () => {
  const lastCart = localStorage.getItem('cart');
  const lastList = document.querySelector(cartItems);
  lastList.innerHTML = lastCart;
  const carItemLocalStorage = document.querySelectorAll(cartItem);
  carItemLocalStorage.forEach((item) => item.addEventListener('click', cartItemClickListener));
  totalCheckout();
};

const cartEmpty = () => {
const emptyCart = document.querySelector('.empty-cart');
console.log(emptyCart);
emptyCart.addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  totalCheckout();
  saveCart();
});
};

window.onload = async function onload() { 
  await searchComputers();
  addButton();
  loadCart();
  cartEmpty();
};