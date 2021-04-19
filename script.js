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
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
function cartItemClickListener(event) {
  console.log(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getSearchQueryResult = async (endpoint) => {
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.results;
};

const getCartItemData = async (itemId) => {
  const endPoint = `https://api.mercadolibre.com/items/${itemId}`;
  const response = await fetch(endPoint);
  const data = await response.json();
  const singleItemInfo = { 
    sku: data.id, 
    name: data.title, 
    salePrice: data.base_price,
  };
  return singleItemInfo;
};

window.onload = async function onload() { 
  // fetches data from the API and adds it to the page
  const apiEndPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const queryResults = await getSearchQueryResult(apiEndPoint);
  queryResults.forEach((item) => {
    const itemInfo = { sku: item.id, name: item.title, image: item.thumbnail };
    const newSectionItem = createProductItemElement(itemInfo);
    newSectionItem.lastChild.addEventListener('click', async () => {
      const singleItemInfo = await getCartItemData(item.id);
      document.querySelector('.cart__items').appendChild(createCartItemElement(singleItemInfo));
    });
    document.querySelector('.items').appendChild(newSectionItem);
  });
};