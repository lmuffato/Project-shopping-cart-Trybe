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

const createTotalItem = () => {
  const totalPriceParentNode = document.createElement('section');
  totalPriceParentNode.className = 'total-price';
  const cart = document.querySelector('.cart');
  cart.appendChild(totalPriceParentNode);
  const total = document.createElement('p');
  total.className = 'shopCart_total';
  totalPriceParentNode.appendChild(total);
};

const updateCartValue = async () => {
  const shopCartList = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.shopCart_total');
  let totalPrice = 0;
  Array.from(shopCartList).forEach((item) => {
    const itemPrice = item.dataset.price;
    totalPrice += parseFloat(itemPrice);
  });
  total.innerHTML = totalPrice;
};

function cartItemClickListener(event) {
  const { target } = event;
  const id = target.dataset.sku;
  // Para esse trecho da função consultei a seguinte documentação:
  // https://catalin.red/removing-an-element-with-plain-javascript-remove-method/
  target.remove();
  updateCartValue();
  // Para o trecho a seguir utilizando dataset, estudei o seguinte conteúdo:
  // https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLOrForeignElement/dataset
  const storageItens = JSON.parse(localStorage.getItem('cartItens'));
  if (storageItens) {
    const newArray = storageItens.filter((product) => product.sku !== id);
    localStorage.setItem('cartItens', JSON.stringify(newArray));
  }
}

const verifyLocalStorage = () => {
  const storageItens = localStorage.getItem('cartItens');
  if (storageItens === null || storageItens === undefined) {
    localStorage.setItem('cartItens', JSON.stringify([]));
  } 
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  // Para o trecho a seguir utilizando dataset, estudei o seguinte conteúdo:
  // https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLOrForeignElement/dataset
  li.dataset.sku = sku;
  li.dataset.price = salePrice;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} 

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  const liParent = document.querySelector('.cart__items');

  // Para essa função passar no avaliador precisei utilizar o loop while,
  // consultei o seguinte artigo:
  // https://www.docow.com/4834/remover-todos-os-elementos-filho-de-um-no-dom-em-javascript.html 
  emptyButton.addEventListener('click', () => {
    while (liParent.hasChildNodes()) { 
      liParent.removeChild(liParent.lastChild); 
    }

    updateCartValue();
    localStorage.removeItem('cartItens');
  });
};

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

// Para essa função consultei a seguinte documentação:
// https://developer.mozilla.org/pt-BR/docs/Web/API/Element/closest
const fetchProductItem = async (e) => {
  const elementParent = e.target.closest('.item');
  const id = elementParent.firstChild.innerText;
  const endPoint = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objectJson = await endPoint.json();
  const { id: sku, title: name, price: salePrice } = objectJson;
  const li = createCartItemElement({ sku, name, salePrice });
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  addItemToLocalStorage({ sku, name, salePrice });
  updateCartValue();
};

const handleCartAddClick = () => {
  const buttonsList = document.querySelectorAll('.item__add');
  Array.from(buttonsList).forEach((button) => {
    button.addEventListener('click', fetchProductItem);
  });
}; 

// Para essa função contei com o auxílio das dicas do Patrick Morais no slack.
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
  verifyLocalStorage();
  chargeLocalStorage();
  createTotalItem();
  updateCartValue();
  emptyCart();
};
