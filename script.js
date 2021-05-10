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

// Grande ajuda de Adelino, Lucas Pedroso e Murilo Gonçalves
const sumTotalPrice = () => {
  const getElementLis = document.querySelectorAll('.cart__item');
  const arrayLis = [...getElementLis];
  const total = arrayLis.reduce((totalPrice, curr) => {
    const price = parseFloat(curr.innerText.split('$')[1]);
    const sumPrice = totalPrice + price;
    return sumPrice;
  }, 0);
  document.querySelector('.total-price').innerText = total;
};

let itemsLocalStorage = [];

const itemLocalStorage = (itemName) => {
  itemsLocalStorage.push(itemName);
  localStorage.setItem('items', JSON.stringify(itemsLocalStorage));
};

function cartItemClickListener(event) {
  const itemCart = event.target;
  const removeLocalStorage = itemCart.innerText.slice(0, 18);
  itemCart.remove();
  const getItemRemove = JSON.parse(localStorage.getItem('items'));
  for (let index = 0; index < getItemRemove.length; index += 1) {
    if (getItemRemove[index].slice(0, 18) === removeLocalStorage) {
      getItemRemove.splice(index, 1);
      localStorage.setItem('items', JSON.stringify(getItemRemove));
      itemsLocalStorage.splice(index, 1);
    }
  } 
  sumTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const getElementOl = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  getElementOl.appendChild(li);
  itemLocalStorage(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
  li.addEventListener('click', cartItemClickListener);
  sumTotalPrice();

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

const onloadLocalStorage = () => {
  const getItemsLocalStorage = JSON.parse(localStorage.getItem('items'));
  localStorage.setItem('items', JSON.stringify(getItemsLocalStorage));
  itemsLocalStorage = getItemsLocalStorage;
  sumTotalPrice();
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

const btnEmptyCart = () => {
  itemsLocalStorage = [];
  localStorage.setItem('items', JSON.stringify(itemsLocalStorage));
  const getListItem = document.querySelectorAll('.cart__item');
  getListItem.forEach((item) => item.remove());
  sumTotalPrice();
};

const loaderPage = () => {
  const getSection = document.querySelector('.container');
  const createDiv = document.createElement('div');
  const div = getSection.appendChild(createDiv);
  div.classList = 'loading';
  div.innerText = 'Loading...';
};

const hiddenLoader = () => {
  const loaderText = document.querySelector('.loading');
  loaderText.remove();
};

const getItens = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json().then((data) => {
    hiddenLoader();
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
      const getBtnEmptyCart = document.querySelector('.empty-cart');
      getBtnEmptyCart.addEventListener('click', btnEmptyCart);
  }));

window.onload = async function onload() {
  await loaderPage();
  await getItens();
  await onloadCartItem();
  await onloadLocalStorage();
};
