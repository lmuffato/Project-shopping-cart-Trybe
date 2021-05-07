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

const itemsLocalStorage = [];
const priceLocalStorage = [];

// evento dentro do carrinho de compras
function cartItemClickListener(event) {
   const itemCart = event.target;
   const removeLocalStorage = itemCart.innerText;
   itemCart.remove();
   const getItemRemove = JSON.parse(localStorage.getItem('items'));
   getItemRemove.splice(getItemRemove.indexOf(removeLocalStorage), 1);
   localStorage.setItem('items', JSON.stringify(getItemRemove));
   itemsLocalStorage.splice(itemsLocalStorage.indexOf(removeLocalStorage), 1);
}

const sumPriceTotal = () => {
  const getPriceLocalStorage = JSON.parse(localStorage.getItem('price'));
  const getElementSpan = document.querySelector('.total-price');
  let result = 0;
  if (getPriceLocalStorage.length > 0) {
    getPriceLocalStorage.forEach((price) => {
      result += price;
      getElementSpan.innerText = `${result}`;
    });
 } else {
   getElementSpan.innerText = `${result}`;
 }
};

const totalPriceCart = (event) => {
  const itemCart = event.target;
   const removeLocalStorage = itemCart.innerText;
   let getPrice = removeLocalStorage.substr(-7);
   if (getPrice[0] === ':') {
     getPrice = removeLocalStorage.substr(-4);
   } if (getPrice[0] === '$') {
     getPrice = removeLocalStorage.substr(-6);
   }
   const getPriceRemove = JSON.parse(localStorage.getItem('price'));
   getPriceRemove.splice(getPriceRemove.indexOf(parseFloat(getPrice)), 1);
   localStorage.setItem('price', JSON.stringify(getPriceRemove));
   priceLocalStorage.splice(priceLocalStorage.indexOf(getPrice), 1);
   sumPriceTotal();
};

const itemLocalStorage = (itemName, salePrice) => {
  itemsLocalStorage.push(itemName);
  priceLocalStorage.push(salePrice);
  localStorage.setItem('items', JSON.stringify(itemsLocalStorage));
  localStorage.setItem('price', JSON.stringify(priceLocalStorage));
  sumPriceTotal();
};

function createCartItemElement({ sku, name, salePrice }) {
  const getElementOl = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  getElementOl.appendChild(li);
  itemLocalStorage(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`, salePrice);
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', totalPriceCart);

  return li;
}

const getElements = (event) => {
  const getIdItem = event.target.parentNode.firstElementChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${getIdItem}`)
    .then((response) => response.json()
    .then((data) => {
     createCartItemElement({ 
      sku: data.id, 
      name: data.title, 
      salePrice: data.price });
  }));
};

const onloadCartItem = () => {
  const getItemsLocalStorage = JSON.parse(localStorage.getItem('items'));
  const getElementOl = document.querySelector('.cart__items');
  if (getItemsLocalStorage.length > 0) {
    for (let index = 0; index < getItemsLocalStorage.length; index += 1) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = getItemsLocalStorage[index];
      getElementOl.appendChild(li);
      li.addEventListener('click', cartItemClickListener);
    }
  }
};

const onloadCartPrice = () => {
  const getPriceLocalStorage = JSON.parse(localStorage.getItem('price'));
  const getElementSpan = document.querySelector('.total-price');
  let result = 0;
  if (getPriceLocalStorage.length > 0) {
    for (let index = 0; index < getPriceLocalStorage.length; index += 1) {
      result += getPriceLocalStorage[index];
      getElementSpan.innerText = `${result}`;
    }
  } else {
    getElementSpan.innerText = `${result}`;
  }
};

const getItens = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json()
  .then((data) => {
    const { results } = data;
    results.forEach((result) => {
      const getElement = document.querySelector('.items');
      const searchComputers = createProductItemElement({
        sku: result.id,
        name: result.title,
        image: result.thumbnail });
      getElement.appendChild(searchComputers);
    });
    const btnAddItemCart = document.querySelectorAll('.item__add');
    btnAddItemCart.forEach((value) => 
      value.addEventListener('click', (event) => getElements(event)));
      onloadCartItem();
      onloadCartPrice();
  }));

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() {
  getItens();
};
