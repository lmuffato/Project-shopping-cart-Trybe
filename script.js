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

const addToCart = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement); // Retirei a ideia de pegar o target pai do Miguel Dantas sala 09 
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const data = await response.json();

  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };

  document.querySelector('ol.cart__items').appendChild(createCartItemElement(obj));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')); ------ Original que veio
  const bt = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  bt.addEventListener('click', addToCart);
  section.appendChild(bt);
  // console.log(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const getItemsFromCart = document.querySelector('.cart__items');
  getItemsFromCart.removeChild(event.target);
}

const removeItem = () => {
  const getItemsFromCart = document.querySelector('cart__item');
  getItemsFromCart.addEventListener('click', cartItemClickListener);
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getResults = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const objPc = {
      sku,
      name,
      image,
    };
    const getSection = document.querySelector('.items');
    getSection.appendChild(createProductItemElement(objPc));
  });
};

window.onload = function onload() {
  getResults();
};