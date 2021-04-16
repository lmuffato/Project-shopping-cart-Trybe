const cart = document.querySelector('.cart__items');

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const totalPrice = document.querySelector('.total-price');

const addSum = (arr) => {
  totalPrice.innerText = arr;
  };

const retrieveLiCArt = () => {
  const listLiCart = document.querySelectorAll('.cart__items li');
  if (listLiCart.length >= 1) return listLiCart;
};

const sumLi = (list) => {
  let sum = 0;
  list.forEach((item) => {
    const text = item.innerText;
    const price = Number(text.split('$')[1]);
    sum += price;
  });
  const str = `${sum}`;
  if (sum === Math.round(sum)) return str;
  if (Number(sum.toFixed(1)) === sum) return `${sum.toFixed(1)}`;
  return `${sum.toFixed(2)}`;
};

const sumTotal = async () => {
 try {
  const cartItems = await retrieveLiCArt();
  const totalSum = await sumLi(cartItems);
  await addSum(totalSum);
 } catch (error) {
   addSum('0');
 }
};

function cartItemClickListener(event) {
  cart.removeChild(event.target);
  sumTotal();
  localStorage.removeItem(event.target.innerText);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(li.innerText, sku);
  return li;  
}

const items = document.getElementById('test');
const container = document.querySelector('.container');
const loadingText = document.createElement('h1');
loadingText.innerText = 'loading...';
loadingText.classList.add('loading');

const fetchElements = () => {
  container.appendChild(loadingText);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((data) => data.json())
  .then((data) => {
    const { results } = data;
    results.forEach((item) => {
      const obj = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      const section = createProductItemElement(obj);
      items.appendChild(section);
    });
  })
  .then(() => {
    container.removeChild(loadingText);
  });
};

const fecthCArItem = (arr) => {
  fetch(`https://api.mercadolibre.com/items/${arr}`)
  .then((data) => data.json())
  .then((item) => {
    const obj = {
      sku: arr,
      name: item.title,
      salePrice: item.price,
    };
   const li = createCartItemElement(obj);
   cart.appendChild(li);
   sumTotal();
  });  
};

const eraseButton = document.querySelector('.empty-cart');
eraseButton.addEventListener('click', () => {
  cart.innerHTML = '';
  sumTotal();
  localStorage.clear();
});

document.body.addEventListener('click', (event) => {
  const list = event.target.className;
  if (list.includes('item__add')) {
  const parent = event.target.parentElement;
  const child = parent.firstChild;
  fecthCArItem(child.innerText);  
  }
});

const getLocalStorage = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    const sku = localStorage.getItem(key);
    fecthCArItem(sku);
  });
};

window.onload = function onload() {
  fetchElements();
  sumTotal();
  getLocalStorage();
 };