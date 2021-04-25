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

const listProd = async () => {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objProd = await api.json();
  return objProd.results;
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
const addProdList = async () => {
  const prods = await listProd();
  const items1 = document.querySelector('.items');
  prods.forEach((eve) => {
    const sun = createProductItemElement(eve);
    items1.appendChild(sun);
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  return console.log(event.target.remove());
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const getIdProd = async (id) => {
  const objId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objReturn = objId.json();
  return objReturn;
};
const addProdInCart = () => {
  document.querySelectorAll('.item__add')
    .forEach((eachProd) => eachProd.addEventListener('click', async (button) => {
      const getSku = getSkuFromProductItem(button.target.parentNode);
      const sectionObj = await getIdProd(getSku);
      const crt = document.querySelector('.cart__items');
      crt.appendChild(createCartItemElement(sectionObj));
    }));
};

window.onload = async function onload() {
  await addProdList();
  await addProdInCart();
};
