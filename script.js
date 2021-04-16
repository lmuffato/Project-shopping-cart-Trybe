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

const createTotalPriceElement = async () => {
  const p = document.createElement('p');
  p.innerText = 0;
  p.className = 'total-price';
  const parentToAdd = document.querySelector('.cart');
  parentToAdd.appendChild(p);
};

const totalPrice = () => {
  const items = document.querySelectorAll('.cart__item');
  if (document.querySelector('.total-price')) {
    if (items !== undefined) {
      let price = 0;
      items.forEach((item) => {
        const itemTXT = item.innerText;
        price += parseFloat(itemTXT.split('$')[1]);
        console.log(price);
      });
      const p = document.querySelector('.total-price');
      p.innerText = price;
    }
  } else createTotalPriceElement();
};

const cartItemClickListener = (event) => {
  // event.target.remove(); Aprendido no plantao (nao lembro quem estava usando)
  const e = event.target;
  const eParent = e.parentNode;
  eParent.removeChild(e);
  totalPrice();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function tratarJSON(url) {
  return fetch(url)
    .then((data) => data.json())
    .then((data) => data.results);
}

async function getProductsInfo() {
  const pc = 'computador';
  const productInfo = await
    tratarJSON(`https://api.mercadolibre.com/sites/MLB/search?q=$${pc}`)
      .then((data) => data);
  return productInfo;
}

const getInfoToCartList = async (id) => {
  const itemInfo = await
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((data) => data.json())
      .then((data) => data);
  return itemInfo;
};

async function creatingItems() {
  const sectionItems = document.querySelector('.items');
  const array = await getProductsInfo();
  array.forEach((item) => {
    const newItem = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    sectionItems.appendChild(createProductItemElement(newItem));
  });
}

const addToCartList2 = async (idItem) => {
  const cartList = document.querySelector('.cart__items');
  const itemToAddInCart = await getInfoToCartList(idItem);
  // console.log(itemToAddInCart);
  const itemToAdd = {
    sku: itemToAddInCart.id,
    name: itemToAddInCart.title,
    salePrice: itemToAddInCart.price
  };
  cartList.appendChild(createCartItemElement(itemToAdd));
  totalPrice();
};

const addToCartList = (event) => {
  const e = event.target;
  const eParent = e.parentNode;
  const id = eParent.querySelector('.item__sku').innerText;
  return addToCartList2(id);
};

const createEventListenerToButtons = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', addToCartList);
  });
};

const emptyCart = async () => {
  const cartItemsList = document.querySelector('.cart__items');
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => {
    cartItemsList.removeChild(item);
  });
  totalPrice();
};
const emptyCartEventListner = () => {
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', emptyCart);
};

window.onload = function onload() {
  creatingItems()
    .then(() => createEventListenerToButtons())
    .then(() => emptyCartEventListner())
    /* .then(() => totalPrice()); precisa ser colocado aqui para ele instanciar o numero 0 ao carregar a pagina
    caso contrario ele vai carregar 0 no total value quando clicar no primeiro item e so depois do segundo
    que realmente ira comecar a somar */
    .then(() => totalPrice());
};