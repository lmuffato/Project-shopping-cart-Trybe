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

function cartClick(event) {
  const { target } = event;
  const id = target.dataset.sku;
  target.remove();
  const storageItens = JSON.parse(localStorage.getItem('cartItens'));
  if (storageItens) {
    const newArray = storageItens.filter((product) => product.sku !== id);
    console.log(newArray);
    localStorage.setItem('cartItens', JSON.stringify(newArray));
  }
}

const validatorLocalStorage = () => {
  const storageItens = localStorage.getItem('cartItens');
  if (storageItens === null || storageItens === undefined) {
    localStorage.setItem('cartItens', JSON.stringify([]));
  } 
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.dataset.sku = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartClick);
  return li;
}

const chargeLocalStorage = () => {
  const products = JSON.parse(localStorage.getItem('cartItens'));
  products.forEach((product) => {
    const li = createCartItemElement(product);
    const ol = document.querySelector('.cart__items');
     ol.appendChild(li);
  });
};

const addItemToLocalStorage = ({ sku, name, salePrice }) => {
  const storageItens = JSON.parse(localStorage.getItem('cartItens'));
  storageItens.push({ sku, name, salePrice });
  localStorage.setItem('cartItens', JSON.stringify(storageItens));
};

const fetchProductItem = async (e) => {
  const parent = e.target.closest('.item');
  const id = parent.firstChild.innerText;
  const endPoint = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objectJson = await endPoint.json();
  const { id: sku, title: name, price: salePrice } = objectJson;

  const li = createCartItemElement({ sku, name, salePrice });
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  addItemToLocalStorage({ sku, name, salePrice });
};

const handleCartAddClick = () => {
  const buttonsList = document.querySelectorAll('.item__add');
  Array.from(buttonsList).forEach((button) => {
    button.addEventListener('click', fetchProductItem);
  });
};

const getObjectItems = async () => {
  const endPoint = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objectJson = await endPoint.json();
  const items = objectJson.results;

  items.forEach((item) => {
    const newObject = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const itemsElement = document.querySelector('.items');
    const creatingElement = createProductItemElement(newObject);
    itemsElement.appendChild(creatingElement);
  });
};

window.onload = function onload() {
  getObjectItems().then(() => {
    handleCartAddClick();
  });
  validatorLocalStorage();
  chargeLocalStorage();
};

// ....snumoc sarvalap òs oãs oãn snoitcnuF ooZ
