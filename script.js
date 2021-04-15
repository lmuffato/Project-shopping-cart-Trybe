const erro = 'Não encontrei nada';
// const classOl = '.cart_items';

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

// Cria elementos section para a lista de produtos
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// Função responsavel pela busca do id do elemento clicado
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função callback para retira um item da lista
function cartItemClickListener({ target }) {
  target.remove();
}

// Cria elementos li para adicionar ao carrinho
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

// Função para limpar toda a lista
const clearList = () => {
  document.querySelector('.cart__items').innerHTML = '';
};

const sumPrices = (price) => {
  const span = document.querySelector('.total-price');
  const valueAtual = parseFloat(span.innerHTML);
  span.innerHTML = price + valueAtual;
  // const span = document.querySelector('.total-price');
  // const value = span.innerHTML;
  // let test = '';
  // for (let index = 14; index < value.length; index += 1) {
  //   test += value[index];
  // }
  // const priceAtual = parseFloat(test);
  // span.innerHTML = `Preço Total: $${priceAtual + price}`;
};

// Busca de daods atraves do 'ID' do produto
const dadosAPI = async (id) => {
  const dados = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const result = await dados.json();
  return result;
};

// Adiciona evento de click em todos "item_add"
const getListCart = async () => {
  const btnCart = document.querySelectorAll('.item__add');
  btnCart.forEach((btn) => {
    btn.addEventListener('click', async () => {
      // console.log('clikei no btn');
      try {
        const dados = await dadosAPI(getSkuFromProductItem(btn.parentNode));
        sumPrices(dados.price);
        document.querySelector('.cart__items').appendChild(createCartItemElement(dados));
      } catch (error) {
        return erro;
      }
    });
  });
};

/*
Funçoes 'dadosAPIPcs' , 'appendComputers' , 'createDados' 
foram criadas atravez de um Code Review do meu colega Renzo Sevilha
com a ideia de nao utilizar o 'then', mas sim usar funcoes 'async'
*/

// Dados de computadores
const dadosAPIPcs = async () => {
  const requisicao = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objDados = await requisicao.json();
  return objDados;
};

// Funcao que cria computadores na pagina
const appendComputers = (dados) => {
  dados.results.forEach((result) => {
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(createProductItemElement(result));
  });
};

// Adiciona computadores na pagina web e lista
const createDados = async () => {
  try {
    const dados = await dadosAPIPcs();
    appendComputers(dados);
    await getListCart();
  } catch (error) {
    return erro;
  }
};

window.onload = function onload() {
  createDados();
  document.querySelector('.empty-cart').addEventListener('click', clearList);
};
