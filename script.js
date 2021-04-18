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

const getCart = () => {
  return document.querySelector('.cart__items');
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendElementToCart = (element) => {
  const olCart = getCart();
  olCart.appendChild(element);
  console.log(element.price);
  saveToLocalStorage('cartList', olCart.innerHTML);
};

const fetchItem = async (item) => {
  const id = item.path[1].firstChild.innerText;
  const data = await fetchData(`https://api.mercadolibre.com/items/${id}`);
  const { id: sku, title: name, price: salePrice } = data;
  const obj = {
    sku,
    name,
    salePrice,
  };
  appendElementToCart(createCartItemElement(obj));
};

const clearCart = () => {
  const ol = getCart();
  ol.innerHTML = '';
  localStorage.removeItem('cartList');
};

const loading = (boolean) => {
  const container = document.querySelector('body');
  if (boolean === true) {
    const spanLoading = document.createElement('span');
    spanLoading.className = 'loading';
    spanLoading.innerHTML = 'loading...';
    container.appendChild(spanLoading);
  } else {
    console.log('remove');
    container.removeChild(container.lastChild);
  }
};
window.onload = async function onload() {
  try {
    const olCart = getCart();
    loadToLocalStorage('cartList', olCart);
    olCart.childNodes.forEach((node) => node.addEventListener('click', cartItemClickListener));
    const uriData = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    loading(true);
    const data = await fetchData(uriData);
    loading(false);
    createElements(data.results);
    const itemAdd = document.querySelectorAll('.item__add');
    itemAdd.forEach((item) => item.addEventListener('click', fetchItem));
    const emptyCart = document.querySelector('.empty-cart');
    emptyCart.addEventListener('click', clearCart);
  } catch (error) {
    console.log(error);
  }
};

/* Cada vez que se adicionar um item ao carrinho de compras, será necessário somar seus valores e apresentá-los na página principal do projeto. Não queremos que essa soma, no entanto, impacte no carregamento da página. Devemos, portanto, fazer essa soma de forma *assíncrona*. Use `async/await` para fazer isso. O elemento que tem como filho o preço total dos itens do carrinho deve ter, **obrigatóriamente**, a classe `total-price`. */