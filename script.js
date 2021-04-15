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

  return section;
}

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

// const fetchProtucts = () => {
//   const itens = document.querySelector('.items');
//   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//     .then((response) => response.json())
//     .then((data) => {
//       const pcsList = data.results;
//       pcsList.forEach((pc) => {
//         const pcsObjects = {
//           sku: pc.id,
//           name: pc.title,
//           image: pc.thumbnail,
//         };
//         itens.appendChild(createProductItemElement(pcsObjects));
//         console.log(pcsObjects);
//       });
//       });
//     };

const fetchProtucts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const pcList = data.results;
  const section = document.querySelector('.items');

  pcList.forEach((itens) => {
    section.appendChild(createProductItemElement(itens));
  });
};

window.onload = () => {
  fetchProtucts();
};
