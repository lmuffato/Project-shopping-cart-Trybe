async function totalValue(price) {
  const current = document.querySelector('.total-price');
  if (document.getElementsByTagName('li').length === 0) {
    current.innerText = price;
  } else {
    const getValue = parseFloat(current.innerText) + price;
    current.innerText = parseFloat(getValue);
  }
 }

async function sub(price) {
  const current = document.querySelector('.total-price')
  const newValue = parseFloat(current.innerText) - price
  current.innerText = parseFloat(newValue)
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

function createProductItemElement({ sku, name, image }) {
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
function clearCart() {
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    const getProductsList = document.getElementsByTagName('li');
    while (getProductsList.length > 0) {
      getProductsList[0].remove();
    }
    window.localStorage.clear();
    // let current =  document.querySelector('.total')
    // current.innerText = 0
  });
}

function saveToLocalStorage() {
  const getProductList = document.querySelectorAll('.cart__items ');
  getProductList.forEach((product) => localStorage.setItem('item', product.innerText));
}

function cartItemClickListener(event) {
  const getElement = event.target.innerText.indexOf("$")
  const getValue = event.target.innerText.slice(getElement+1)
  sub(getValue)
  event.target.remove();
  saveToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItem(item) {
  const id = await item.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resp) => {
    resp.json()
    .then((data) => {
      const addedItem = { 
            sku: data.id, 
            name: data.title, 
            salePrice: data.price, 
          };
      totalValue(addedItem.salePrice);
      document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(addedItem));
      saveToLocalStorage();
    });
  });
}

function loading() {
  const getLoadingElement = document.querySelector('.loading');
  return getLoadingElement.remove();
}
async function getData(product) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${product}`)
  .then((resp) => {
    resp.json()
    .then((data) => {
      data.results.forEach((item, index) => {
      const resultObj = { 
        sku: item.id, 
        name: item.title, 
        image: item.thumbnail, 
      };
      document.getElementsByClassName('items')[0].appendChild(createProductItemElement(resultObj));
      document.getElementsByClassName('item__add')[index].addEventListener('click', addItem); 
      });     
    });
    loading();
  });
}

// function getLocalStorage() {
//   for (let index = 0; index <= localStorage.length; index += 1) {
//     document.getElementsByClassName('cart__items')[0]
//     .appendChild(createCartItemElement(localStorage.key(index)))
//   }
// }

// function getLocalStorage() {
//   const getList = document.querySelector('.cart__items ');
//   // console.log(localStorage.getItem('item'))
//   getList.innerText = localStorage.getItem('item');
// }

window.onload = function onload() { 
  getData('computador');
  // getLocalStorage()
  clearCart();
};