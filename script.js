const fetchProducts = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const { results } = await response.json();
    return results;
  } catch (error) {
    console.log(error);
  }
};

let totalPrice = 0;

const calcTotalPrice = {
  sum: async (price) => {
    totalPrice += price;
    return totalPrice;
  },
  sub: async (price) => {
    totalPrice -= price;
    return totalPrice;
  },
};

const showTotalPrice = async (price, operation) => {
  const finalPrice = await calcTotalPrice[operation](price);
  const totalPriceConteiner = document.querySelector('.total-price');
  totalPriceConteiner.innerHTML = finalPrice;
};

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

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const appendProduct = (product) => {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(createProductItemElement(product));
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const getCartList = () => {
  const items = document.querySelectorAll('.cart__item');
  const list = Object.values(items).map((item) => item.id);
  return list;
};

const saveCartList = () => {
  localStorage.setItem('cart_items', getCartList());
};

const cartItemClickListener = (event) => {
  const price = Number(event.target.innerHTML.split('PRICE: $')[1]);
  showTotalPrice(price, 'sub');
  event.target.remove();
  saveCartList();
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addCartItem = (item) => {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(item));
  showTotalPrice(item.price, 'sum');
};

const fetchItem = async (sku) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const showItems = (skus) => {
  skus.split(',').forEach(async (sku, index) => {
    try {
      const item = await fetchItem(sku);
      await addCartItem(item);
      console.log(index);
    } catch (error) {
      console.log(error);
    }
  });
};

const getLocalStorageCartList = async () => {
  const skus = localStorage.getItem('cart_items');
  if (skus) await showItems(skus);
};

const cartButtonEvent = () => {
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const sku = getSkuFromProductItem(e.target.parentNode);
      fetchItem(sku)
      .then((data) => {
        addCartItem(data);
        saveCartList();
      });
    });
  });
};

const emptyCartButton = document.querySelector('.empty-cart');
emptyCartButton.addEventListener('click', () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  showTotalPrice(totalPrice, 'sub');
  saveCartList();
});

const removeLoading = () => document.querySelector('.loading').remove();

window.onload = async () => {
  try {
    await fetchProducts()
      .then((results) => results.forEach((product) => appendProduct(product)));
    removeLoading();
    await cartButtonEvent();
  } catch (error) {
    console.log(error);
  }
  getLocalStorageCartList();
};
