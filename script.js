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

const searchComputers = () => (new Promise((resolve) => {
  // Como recuperar dados de uma API usando promises no javascript: https://www.youtube.com/watch?v=v9JVA6tVmcg&ab_channel=EmersonBroga
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((data) => resolve(data.results));
  })
);

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

window.onload = function onload() { 
  const sectionItems = document.getElementsByClassName('items');
  console.log(sectionItems);
  (searchComputers()
    .then((computers) => {
      computers.forEach((computer) => {
        const item = createProductItemElement({
          sku: computer.id, 
          name: computer.title, 
          image: computer.thumbnail,
        });
        sectionItems[0].appendChild(item);
      });
    })
  );
};

// Referências:
// Repositórios consultados para entender como usar as promisses e fazer o requisito 1: 
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/119/commits/6a52ec57dbfc0d5f2ba34bb96c7090f692fd0e5d
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/104/commits/2426adac2d023b4ff5e5634dd51d4f86ae02cfb0
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/117/commits/063c01155cecdc7690490f347c0241458eb864b2
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/109/commits/d17d596a4eaec6d637755c0ff5c88904dc4334bc
