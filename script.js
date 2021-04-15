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

function cartItemClickListener(event) {
  // Para esse trecho da função consultei a seguinte documentação:
  // https://catalin.red/removing-an-element-with-plain-javascript-remove-method/
  const { target } = event;
  target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Para essa função consultei a seguinte documentação:
// https://developer.mozilla.org/pt-BR/docs/Web/API/Element/closest
const fetchProductItem = async (e) => {
  const elementParent = e.target.closest('.item');
  const id = elementParent.firstChild.innerText;
  const endPoint = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objectJson = await endPoint.json();
  const { id: sku, title: name, price: salePrice } = objectJson;

  const li = createCartItemElement({ sku, name, salePrice });
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

const handleCartAddClick = () => {
  const buttonsList = document.querySelectorAll('.item__add');
  Array.from(buttonsList).forEach((button) => {
    button.addEventListener('click', fetchProductItem);
  });
}; 

// Para essa função contei com o auxílio das dicas do Patrick Morais no slack.
const getObjectItems = async () => {
  const endPoint = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objectJson = await endPoint.json();
  const items = objectJson.results;

  items.forEach((item) => {
    const newObject = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const itemsElement = document.querySelector('.items');
    const creatingElement = createProductItemElement(newObject);
    itemsElement.appendChild(creatingElement);
  });
};

window.onload = function onload() { 
  getObjectItems().then(() => {
    handleCartAddClick();
  });
};
