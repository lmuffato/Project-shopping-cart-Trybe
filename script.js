window.onload = function onload() { };

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const onScreem = document.querySelector('.items');
  onScreem.appendChild(section);
  return section;
}
const req1 = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      const arrayData = data.results;
      const ul = document.createElement('ul');
      document.querySelector('.items').appendChild(ul);
      arrayData.forEach((values) => {
        const li = document.createElement('li');
        li.style = 'list-style: none';
        ul.appendChild(li);
        li.appendChild(createProductItemElement(values));
      });
    });
};
req1();

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
getSkuFromProductItem();

function cartItemClickListener(event) {
  return event;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
createCartItemElement();