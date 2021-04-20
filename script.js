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

const infoLoading = () => {
  const createTag = document.createElement('p');
  const items = document.querySelector('.items');
  items.appendChild(createTag);
  createTag.className = 'loading';
  createTag.innerHTML = 'loading...';
};

const removeInfoLoading = () => {
  const items = document.querySelector('.items');
  const p = document.querySelector('.loading');
  items.removeChild(p);
};
const getItemPromise = async () => {
  const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((resolve) => resolve.json().then((Data) => Data.results));
  return data;
};
const appendChild = async () => {
  const data = await getItemPromise();
  data.forEach((computador) => {
    const infoComputador = {
      sku: computador.id,
      name: computador.title,
      image: computador.thumbnail,
    };
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(infoComputador));
  });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// // }

const saveLocalStorage = (parametro) => {
  // const items = document.querySelector('.cart__items');
  if (localStorage.getItem('shop__cart') !== null) {
    const array = JSON.parse(localStorage.getItem('shop__cart'));
    localStorage.setItem('shop__cart', JSON.stringify([...array, parametro]));
  } else {
    localStorage.setItem('shop__cart', JSON.stringify([parametro]));
  }
};

function cartItemClickListener(event) {
  event.target.remove();
  // localStorage.
  // saveLocalStorage()
}
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductToCart = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const ids = event.target.parentNode.firstChild.innerText;
      const product = await fetch(`https://api.mercadolibre.com/items/${ids}`)
        .then((response) => response.json()
          .then((data) => data));
      //  console.log(product);
      const newObject = {
        id: product.id,
        name: product.title,
        price: product.price,
      };
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createCartItemElement(product));
      saveLocalStorage(newObject);
    }
  });
};

const removeProductToCart = () => {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    const li = document.querySelectorAll('.cart__item');
    for (let index = 0; index < li.length; index += 1) {
      ol.removeChild(li[index]);
    }
  });
};

window.onload = function onload() {
  addProductToCart();
  removeProductToCart();
  infoLoading();
  setTimeout(() => {
    removeInfoLoading();
  }, 2950);
  setTimeout(() => {
    appendChild();
  }, 3000);
};
