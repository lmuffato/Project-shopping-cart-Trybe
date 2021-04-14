// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
// }

// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const obj = {
    sku,
    name,
    image,
  };
  section.className = 'item';
  return obj;

  // section.appendChild(createCustomElement('span', 'item__sku', sku));
  // section.appendChild(createCustomElement('span', 'item__title', name));
  // section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  // return section;
}

window.onload = function onload() {
  const obj = {
    sku: 123, 
    name: 'nomeTeste', 
    image: 'https://startupi.com.br/wp-content/uploads/2020/04/desenvolvimento-low-code.jpeg',
  };
  createProductItemElement(obj);
};
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
