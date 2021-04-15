const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
};

const sumTotal = () => {
  const totalPriceElement = document.getElementsByClassName('total-price')[0];
  const cartList = document.querySelectorAll('.cart__item');
  let total = 0;

  for (let index = 0; index < cartList.length; index += 1) {
    const splited = cartList[index].innerHTML.split(' ');
    const price = Number(splited[splited.length - 1].split('$')[1]);
    total += price;
  }

  totalPriceElement.innerHTML = total;
  localStorage.setItem('total', JSON.stringify(total));
};

const cartItemClickListener = (event) => {
  const element = event.target;

  const cartList = document.getElementsByClassName('cart__items')[0];
  cartList.removeChild(element);
  sumTotal();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const saveItemStorage = (item) => {
  const storageValue = JSON.parse(localStorage.getItem('cart'));

  if (!storageValue) {
    localStorage.setItem('cart', JSON.stringify([item]));
    return;
  }

  storageValue.push(item);
  localStorage.setItem('cart', JSON.stringify(storageValue));
};

const addToCart = async (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(async (response) => {
      const jsonReponse = await response.json();

      const item = {
        sku: jsonReponse.id,
        name: jsonReponse.title,
        salePrice: jsonReponse.price,
      };

      const cartItem = createCartItemElement(item);
      const cartList = document.getElementsByClassName('cart__items')[0];
      cartList.appendChild(cartItem);
      saveItemStorage(item);
    })
    .then(() => {
      sumTotal();
    });
};

const clearLoading = () => {
  const loading = document.querySelector('.loading');
  const items = document.getElementsByClassName('items')[0];
  items.removeChild(loading);
};

const getList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then(
    async (response) => {
      const jsonReponse = await response.json();
      const products = jsonReponse.results.map((product) => ({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      }));
      await products.forEach((product) => {
        const newItem = createProductItemElement(product);
        newItem.onclick = () => addToCart(product.sku);
        const items = document.getElementsByClassName('items')[0];

        items.appendChild(newItem);
      });
      clearLoading();
    },
  );
};

const getCartItems = () => {
  const items = JSON.parse(localStorage.getItem('cart'));
  if (items) {
    items.forEach((item) => {
      const cartItem = createCartItemElement(item);
      const cartList = document.getElementsByClassName('cart__items')[0];
      cartList.appendChild(cartItem);
    });
  }
};

const getTotalValue = () => {
  const totalPriceElement = document.getElementsByClassName('total-price')[0];
  const totalValue = JSON.parse(localStorage.getItem('total'));
  totalPriceElement.innerHTML = totalValue;
};

const clearCarts = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';

  localStorage.removeItem('cart');
  localStorage.removeItem('total');
  sumTotal();
};

window.onload = function onload() {
  getList();
  getCartItems();
  getTotalValue();

  const emptyButton = document.getElementsByClassName('empty-cart')[0];
  emptyButton.onclick = clearCarts;
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
