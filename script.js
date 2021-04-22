const itemm = document.getElementsByClassName('items');
const cartitens = document.getElementsByClassName('cart__items');
const cart = document.getElementsByClassName('cart');
const total = document.getElementsByClassName('total-price');
const selecteditens = document.getElementsByClassName('cart__item');

const valueHolder = (value) => {
  const placeHolder = document.createElement('div');
  placeHolder.innerHTML = value;
  placeHolder.className = 'total-price';
  if (total.length === 0) { 
  cart[0].appendChild(placeHolder);
  }
  cart[0].removeChild(cart[0].lastChild);
  cart[0].appendChild(placeHolder);
};

async function sumPrices() {
  let totalvalue = 0;
  const allElements = cartitens[0].children;
  for (let index = 0; index < allElements.length; index += 1) {
    const info = Object.values(allElements[index].innerHTML.split(' '));
    const valuable = info[info.length - 1].slice(1);
    totalvalue += parseFloat(valuable);
  }
  valueHolder(totalvalue);
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

function storageUnit() {
  const saveInfo = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_info', saveInfo);
}

const deleteAllCart = () => {
  const specElement = cart[0].children[2];
  const size = specElement.children.length;
  for (let index = 0; index < size; index += 1) {
    specElement.lastChild.remove();
  }
  storageUnit();
  sumPrices();
};

function cartItemClickListener(event) {
  for (let index = 0; index < selecteditens.length; index += 1) {
    if (selecteditens[index] === event.target) {
      selecteditens[index].remove(event.target); 
    }
  }
  storageUnit();
  sumPrices();
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
  
  function getSkuFromProductItem(item) {
    const product = item.target.parentElement;
    const id = product.querySelector('span.item__sku').innerText;
    itemSelector(id);
  }
  
  function createProductItemElement({ sku, name, image }) {
    const section = document.createElement('section');
    section.className = 'item';
    section.appendChild(createCustomElement('span', 'item__sku', sku));
    section.appendChild(createCustomElement('span', 'item__title', name));
    section.appendChild(createProductImageElement(image));
    const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
    section.appendChild(button);
    button.addEventListener('click', getSkuFromProductItem);
    return section;
  }
  
  async function getInfo() {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const info = await response.json();
    const { results } = info;
    results.forEach((item) => {
      const infoExport = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
    itemm[0].appendChild(createProductItemElement(infoExport));
    });
  }
  
  const savedInfo = () => {
    const saved = localStorage.getItem('cart_info');
    cartitens[0].insertAdjacentHTML('afterbegin', saved);
    cartitens[0].addEventListener('click', cartItemClickListener);
  };
  
  window.onload = function onload() {
    getInfo();
    savedInfo();
    sumPrices();
    clearCart();
  };
