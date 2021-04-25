const divItems = document.querySelector('.items');
const cartOl = document.querySelector('.cart__items');
const totalPriceDiv = document.querySelector('.total-price');
const toStorage = () => {
  localStorage.setItem('cart', cartOl.innerHTML);
  localStorage.setItem('total', totalPriceDiv.innerHTML);
};

const loading = () => {
  const createLoading = document.createElement('h2');  
  createLoading.className = 'loading';
  createLoading.innerHTML = 'loading...';
  document.body.appendChild(createLoading);
};

const done = () => {
  document.querySelector('.loading').remove();
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

  divItems.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const searchComputers = async () => {
  try {
    loading();
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const data = await response.json();    
      if (data) {        
        const computersArr = data.results;
        computersArr.forEach((computer) => {
          divItems.appendChild(createProductItemElement(computer));
        }); 
        done();
      } else {
        divItems.innerHTML = data.error;
          } 
          } catch (err) {
        console.log(err);
    }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// // source: https://github.com/tryber/sd-010-a-project-shopping-cart/blob/scriptcamilo-project-shopping-cart/script.js
// const total = async () => {
//   // captura a sessão
//   const cart = document.querySelector('.cart');
//   // pega nodelist
//   const cartItems = document.querySelector('.cart__items').childNodes;
//   let totalPrice = 0;

//   cartItems.forEach(({ innerText }) => {
//     // https://www.w3schools.com/jsref/jsref_number.asp
//     const price = Number(innerText.split('$')[1]);
//     totalPrice += price;
//   }, 0);

//   if (document.querySelector('.total-price')) {
//     const actualPrice = document.querySelector('.total-price');
//     actualPrice.innerText = `${totalPrice}`;
//   } else {
//     cart.appendChild(createCustomElement('span', 'total-price', `${totalPrice}`));
//   }
// };

let totalPrice = 0;

const total = async (price) => {
  // const cart = document.querySelector('.cart');
  totalPrice += Number(price);
  console.log(totalPrice);
  if (document.querySelector('.total-price')) {
    // totalPriceDiv.innerText = `${Math.round(totalPrice + price).toFixed(2)}`;
    totalPriceDiv.innerText = `${Math.round((totalPrice) * 100) / 100}`;
  } // else {
    // cart.appendChild(createCustomElement('span', 'total-price', `${totalPrice}`));
  // }
};

const cartItemClickListener = async (event) => {
  event.target.remove();
  toStorage();  
};

const fromStorage = () => {
  const storagedItems = localStorage.getItem('cart');
  const storagedTotal = localStorage.getItem('total');

  cartOl.innerHTML = storagedItems;
  totalPriceDiv.innerHTML = storagedTotal;
  
  cartOl.addEventListener('click', cartItemClickListener);
};

// function createCartItemElement({ id, title, price }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function createCartItemElement({ id, title, price }) {
  total(price);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const pushItem = () => {
  divItems.addEventListener('click', async (event) => {
    try {
      const itemID = getSkuFromProductItem(event.target.parentNode);
      // loading();
      const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
      const data = await response.json();
      // done();
      cartOl.appendChild(createCartItemElement(data));
      // await total();
      toStorage();      
    } catch (err) {
        console.log(err);
    }
  });
}; 

const toClear = () => {
  document.querySelector('.empty-cart')
    .addEventListener('click', () => {
      if (totalPriceDiv) {
        totalPriceDiv.innerText = 0;
        totalPrice = 0;
      }
      cartOl.innerHTML = '';
      toStorage();
    });
};

window.onload = function onload() {
  searchComputers();
  pushItem();
  fromStorage();
  toClear();
  // total();
};