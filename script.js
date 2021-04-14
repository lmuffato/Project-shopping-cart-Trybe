const erro = 'Não encontrei nada';

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   console.log('cliclei no li');
// }

// function createCartItemElement({ id, title, price }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
//   li.addEventListener('click', cartItemClickListener);
//   console.log(li);
//   return li;
// }

// const dadosAPI = async () => {
//   const dados = await fetch('https://api.mercadolibre.com/items/MLB1341706310');
//   const dadosValue = await dados.json();
//   return dadosValue;
// };

// const createValue = async () => {
//   try {
//     createCartItemElement(await dadosAPI());
//   } catch (error) {
//     return erro;
//   }
// };

// console.log(dadosAPI().then((dados) => console.log(dados)));
// createValue();

/*
Funçoes 'dadosAPI' , 'appendListComputers' , 'createDados' 
foram criadas atravez de um Code Review do meu colega Renzo Sevilha
com a ideia de nao utilizar o 'then', mas sim usar funcoes 'async'
*/

const dadosAPIPcs = async () => {
  const requisicao = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objDados = await requisicao.json();
  return objDados;
};

const appendComputers = (dados) => {
  dados.results.forEach((result) => {
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(createProductItemElement(result));
  });
};

const createDados = async () => {
  try {
    appendComputers(await dadosAPIPcs());
  } catch (error) {
    return erro;
  }
};

window.onload = function onload() {
  createDados();
};
