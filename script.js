const cartItems = '.cart__items';

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

const loadingMessage = async () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'Loading...';

  const container = document.querySelector('.container');
  container.appendChild(loading);
};

const deleteLoadingMessage = async () => {
  const loading = document.querySelector('.loading');

  const container = document.querySelector('.container');
  container.removeChild(loading);
};

async function getProductApi() { 
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data);
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

async function createListProductItems() {
  const { results } = await getProductApi();
  const productsContainer = document.querySelector('.items');
  productsContainer.innerHTML = '';

  results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    productsContainer.appendChild(createProductItemElement({ sku, name, image }));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartItensContainer = document.querySelector(cartItems);
  const productSelected = event.target;
  
  cartItensContainer.removeChild(productSelected);
}

const getProductBySku = async (sku) => {
 const product = fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((data) => data);
  return product;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.classList.add(`${salePrice}`);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const saveCart = async () => {
  const cartList = document.querySelector(cartItems);
  localStorage.setItem('listSaved', cartList.outerHTML);
};

const summPriceCartProducts = async (price) => {
  const summElement = document.querySelector('.total-price');

  if (summElement.innerHTML === '') {
    summElement.innerText = price;
  } else {
    summElement.innerText = (parseFloat(summElement.innerText) + price).toFixed(2);
  }
};

const putItemInCart = async (product) => {
  const cartItensContainer = document.querySelector(cartItems);

  cartItensContainer.appendChild(createCartItemElement(product));
  summPriceCartProducts(product.salePrice);
  saveCart();
};

const onClick = async (event) => {
  const buttonSelect = event.target.parentNode;
  const idProduct = await getSkuFromProductItem(buttonSelect);
  const productSelected = await getProductBySku(idProduct);
  const objectProduct = {
    sku: productSelected.id,
    name: productSelected.title,
    salePrice: productSelected.price,
  };
  putItemInCart(objectProduct);
};

const addEventButtons = async () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', onClick));
};

const clearButton = () => {
  const cartItens = document.querySelector(cartItems);
  const price = document.querySelector('.total-price');
  cartItens.innerHTML = '';
  price.innerText = '';
  saveCart();
};

const buttonClearEvent = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', clearButton);
};

window.onload = async function onload() { 
  loadingMessage();
  if (localStorage.length >= 1) {
    const storedList = localStorage.getItem('listSaved');
    const changeList = document.querySelector(cartItems);
    changeList.outerHTML = storedList;
  }
  createListProductItems()
    .then(() => deleteLoadingMessage())
    .then(() => addEventButtons())
    .then(() => buttonClearEvent());
};

// o window.onload foi colocado abaixo devido a ele ter que fazer as funções acima primeiro, para depois ele reconhecer e utilizá-las.

// Graças ao Murilo Gonçalves, em uma call no Slack, 15/04, eu pude entender como utilizar funções async. Assim como quebrar a cabeça para entender que quando utilizado o await para uma função, a função onde ele está também deve ser uma async. Assim como só iremos conseguir maninupar o json quando a função dele retorna com o await.

// Requisto da conta do carinho. Pensei em adicionar um elemento igual ao span invisível dos produtos, contendo o price nele, mas isso tenho que colocar dentro da Li criada, pois tera a interação de retirá-la. Ao mesmo tempo a função de soma tem que pegar todas aquelas spans invisíveis do carrinho e somar seus preços com base nas suas existências. Lembrando de ver o seu Style!