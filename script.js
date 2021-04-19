const cartItemClass = '.cart__items';

const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const classPrice = document.querySelector('.total-price');

const saveStorage = () => {
  const saveItem = document.querySelector(cartItemClass);
  localStorage.setItem('cartItem', saveItem.innerHTML);
  localStorage.setItem('priceTotal', classPrice.innerHTML);
};

const totalPrice = async () => {
  let sum = 0;
  const cartItemLi = document.querySelector(cartItemClass);
  cartItemLi.childNodes.forEach((element) => {
    const price = element.innerText.split('$')[1];
    sum += Number(price);
    return sum;
  });
  saveStorage();
  classPrice.innerHTML = `${sum}`;
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
  saveStorage();
}

const loadStorage = () => {
  classPrice.innerHTML = localStorage.getItem('priceTotal');
  const loadItem = document.querySelector(cartItemClass);
  loadItem.innerHTML = localStorage.getItem('cartItem');
  document.querySelectorAll('.cart__item').forEach((e) => {
    e.addEventListener('click', cartItemClickListener);
  });
};

function createCartItemElement({ id: sku, title: name, price: salesPrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salesPrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getPcId = async () => {
  const fetchPc = await fetch(URL).then((response) => response.json());
  return fetchPc;
};

const getCartId = async (id) => {
  const fetchCart = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json());
  return fetchCart;
};

const getPcsFromId = ({ results }) => {
  results.forEach((product) => {
    document.querySelector('.items')
    .appendChild(createProductItemElement(product));
  });
};

const cartItems = async () => {
  document.querySelectorAll('.item__add').forEach((event) => {
    event.addEventListener('click', async () => {
      try {
        const dataIn = await getCartId(getSkuFromProductItem(event.parentNode));
        document.querySelector(cartItemClass)
        .appendChild(createCartItemElement(dataIn));
        totalPrice();
        saveStorage();
      } catch (error) {
        console.log('algo deu errado', error);
      }
    });
  });
};

window.onload = async function onload() {
  try {
    getPcsFromId(await getPcId());
    await cartItems();
  } catch (error) {
    console.log('erro ai');
  }
};
loadStorage();