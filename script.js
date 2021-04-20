

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

function createProductItemElement({sku, name, image}) {
   const section = document.createElement('section');
   section.className = 'item';

   section.appendChild(createCustomElement('span', 'item__sku', sku));
   section.appendChild(createCustomElement('span', 'item__title', name));
   section.appendChild(createProductImageElement(image));
   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
   
   document.body.appendChild;
   
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

const listProducts = async () => {
  const item = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

async function getProducts() {
  const produtos = await listProducts();
  produtos.forEach((element) => {
    const prods = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    }
    const item = createProductItemElement(prods);
    document.querySelector('.items').appendChild(item);
  });
}; 


window.onload = function onload() {
  getProducts();
  console.log(listProducts());
  //filterForResults();  
};