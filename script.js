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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}
const appendElement = (element) => {
  const elementToAppend = createProductItemElement(element);
  document.querySelector('.items').appendChild(elementToAppend);
};

const createElements = (data) => {
  data.forEach((item) => {
    const obj = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };

    appendElement(obj);
  });
};
const fetchData = async (uri) =>
  new Promise((resolve, reject) => {
    fetch(uri)
      .then((resp) => resp.json())
      .then((data) => {
        if (data) resolve(data);
        return reject(new Error('Falha ao buscar os dados!!'));
      });
  });

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

const loadToLocalStorage = (key, itemToAppend) => {
  const item = localStorage.getItem(key);
  const appendItem = itemToAppend;
  appendItem.innerHTML = item;
};

function cartItemClickListener(event) {
  const parent = event.path[0].parentNode;
  parent.removeChild(event.path[0]);
  saveToLocalStorage('cartList', parent.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  return li;
}

const appendElementToCart = (element) => {
  const olCart = document.querySelector('.cart__items');
  olCart.appendChild(element);
  saveToLocalStorage('cartList', olCart.innerHTML);
};

const fetchItem = async (item) => {
  const id = item.path[1].firstChild.innerText;
  const data = await fetchData(`https://api.mercadolibre.com/items/${id}`);
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  appendElementToCart(createCartItemElement(obj));
};
window.onload = async function onload() {
  try {
    const olCart = document.querySelector('.cart__items');
    loadToLocalStorage('cartList', olCart);
    olCart.childNodes.forEach((node) => node.addEventListener('click', cartItemClickListener));
    const uriData = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const data = await fetchData(uriData);
    createElements(data.results);
    const itemAdd = document.querySelectorAll('.item__add');
    itemAdd.forEach((item) => item.addEventListener('click', fetchItem));
  } catch (error) {
    console.log(error);
  }
};
