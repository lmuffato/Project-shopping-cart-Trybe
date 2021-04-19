const cartItems = '.cart__items';
const cartItemsLi = '.cart__items li';

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

const storageCartShop = () => {
  const sectionItems = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('cartShop', sectionItems);
};

const loadCartShop = () => {
  const sectionItems = document.querySelector(cartItems);
  const loadItem = localStorage.getItem('cartShop');
  sectionItems.innerHTML = loadItem;
};

const sectionLis = async () => {
  const sectionLi = document.querySelectorAll(cartItemsLi);
  if (sectionLi.length !== null) {
    return sectionLi;
  }
};

const sumTotalPrices = async (sectionList) => {
  let sum = 0;
  sectionList.forEach((item) => {
    const extractPrice = item.innerText.split('$');
    const price = parseFloat(extractPrice[1]);
    sum += price;
  });
  const sumTotal = Math.round(sum * 100) / 100;
  return sumTotal;
};

const spanTotalPrice = async (total) => {
  const spanTotal = document.querySelector('.total-price');
  spanTotal.innerText = `${total}`;
};

const verifySumAsync = async () => {
  try {
    const li = await sectionLis();
    const totalPrices = await sumTotalPrices(li);
    await spanTotalPrice(totalPrices);
  } catch (error) {
    console.log('erro na soma');
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const listItem = event.target;
  listItem.remove();
  verifySumAsync();
  storageCartShop();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getCartItems = (listCart) => {
  const { id, title, price } = listCart;
  const cartObj = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const sectionCart = document.querySelector(cartItems);
  sectionCart.appendChild(createCartItemElement(cartObj));
  verifySumAsync();
  storageCartShop();
};

const getFetchId = async (idElement) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${idElement}`);
    const ids = await response.json();
    getCartItems(ids);
  } catch (error) {
    console.log(error);
  }
};

const loading = () => {
  const positionLoading = document.querySelector('body');
  const loadingApi = document.createElement('span');
  loadingApi.className = 'loading';
  loadingApi.innerText = 'Loading...';
  positionLoading.appendChild(loadingApi);
};

const stopLoading = async () => {
 const stop = document.querySelector('.loading');
 stop.outerHTML = null;
};

const getListItems = async (listItem) => {
  const { results } = listItem;
  results.forEach((result) => {
    const itensObj = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    const sectionItem = document.querySelector('.items');
    sectionItem.appendChild(createProductItemElement(itensObj));
  });
  stopLoading();
};

const getListProducts = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const object = await response.json();
    return object;
  } catch (error) {
    console.log(error);
  }
};

const verifyAsyncData = async () => {
  try {
    const dataApi = await getListProducts();
    await getListItems(dataApi);
  } catch (error) {
    console.log('erro na pesquisa');
  }
};

const getSkuFromProductItem = (event) => {
  let parental = '';
  let firstChild = '';
  if (event.target.classList.contains('item__add')) {
    parental = event.target;
    firstChild = parental.parentNode.firstChild.innerText;
    return getFetchId(firstChild);
  }
};

const btnEmptyCart = (event) => {
  const sectionLi = document.querySelectorAll(cartItemsLi);
  if (event.target.classList.contains('empty-cart')) {
    sectionLi.forEach((li) => {
      li.remove();
      verifySumAsync();
      storageCartShop();
    });
  }
};

document.addEventListener('click', getSkuFromProductItem);
document.addEventListener('click', btnEmptyCart);

window.onload = function onload() {
  loading();
  verifyAsyncData();
  loadCartShop();
};