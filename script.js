// ----------- Ready codes ---------/
const getCartItems = () => document.querySelector('.cart__items');

function createProductImageElement(imageSource) { // create imgThumbnail.
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // create spanID, spanTitle and buttonAddCart;
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail }) { // create the section with your children's (img, span, button).
  const section = document.createElement('section');
  // console.log(id, title, thumbnail);
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
const saveLisToLocalStorage = () => {
  const ul = getCartItems();
  // console.log(lis);
  localStorage.clear();
  console.log('Clear in localStorage.');
  localStorage.setItem('listCartItems', JSON.stringify(ul.innerHTML));
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLisToLocalStorage();
  // salvar ul no localStorage
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  saveLisToLocalStorage();
  return li;
}

const addEvListenerAfterLocalStorage = () => {
  if (localStorage.getItem('listCartItems') !== undefined) {
    const lis = document.querySelectorAll('.cart__item');
    lis.forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
};

const getLisOfLocalStorage = () => {
  if (localStorage.getItem('listCartItems') !== undefined) {
    const recoveredList = localStorage.getItem('listCartItems');
    const ul = getCartItems();
    ul.innerHTML = JSON.parse(recoveredList);
    addEvListenerAfterLocalStorage();
  } else {
    console.log('Não há nada no local storage.');
  }
};

const foundItems = async (endPoint) => new Promise((resolve) => { // API endpoint search, returns data (object).
  fetch(endPoint)
    .then((response) => {
      response.json()
        .then((data) => {
          resolve(data);
        });
    });
  // reject(new Error('endpoint não existe.'));
});

const addItemToCart = async (id) => {
  const endPointCustom = `https://api.mercadolibre.com/items/${id}`;
  const itemData = await foundItems(endPointCustom);
  const newCartItemElement = createCartItemElement(itemData);
  getCartItems().appendChild(newCartItemElement);
  // salvar a ul no localStorage.
  saveLisToLocalStorage();
};

const setEventsToAddCartButtons = () => { // places an AddEventListener on each button of the item__adds class.
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.parentNode.firstElementChild.innerText;
      addItemToCart(id);
    });
  });
};

const setItems = async () => { // add childrens for section 'items'. 
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const datas = (await foundItems(endPoint)).results;
  datas.forEach((data) => {
    const newElement = createProductItemElement(data);
    document.querySelector('.items').appendChild(newElement);
  });
  setEventsToAddCartButtons();
};

window.onload = function onload() {
  setItems();
  getLisOfLocalStorage();
  // addEvListenerAfterLocalStorage();
};
