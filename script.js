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

const createList = (data) => {
   const dados = data.forEach((element) => {
   const section = document.querySelectorAll('.items')[0];
   section.appendChild(createProductItemElement(element));
   return section;
  });
  return dados;
};

const fetchDataList = () => new Promise((resolve, reject) => {  
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        resolve(data.results);
        console.log(data.results);
        document.getElementsByClassName('loading')[0].remove();
      })
        .catch((erro) => {
          reject(erro);
        });
    });
});

const itens = () => document.querySelectorAll('.cart__items');

const itensStorage = () => {
  itens().forEach((element) => {
  localStorage.setItem('CartItens', element.innerHTML);
  });
};

function cartItemClickListener(event) {
  console.log(event);
  const clicar = event.target;
  clicar.remove();
  itensStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const revomeItensStorage = () => {
  itens().forEach((element) => {
  element.addEventListener('click', cartItemClickListener);
  });
};

const loadStorage = () => {
  itens().forEach((element) => {
  const item = element;
  item.innerHTML = localStorage.getItem('CartItens');
  });
  revomeItensStorage();
};

const fetchAdicionar = (itemID) => new Promise((resolve, reject) => {
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => {
      response.json().then((dados) => {
        const sku = dados.id;
        const name = dados.title;
        const salePrice = dados.price;
        const olElement = document.getElementsByClassName('cart__items')[0];
       olElement.appendChild(createCartItemElement({ sku, name, salePrice }));
       itensStorage();
      resolve(dados);
    })
      .catch((erro) => {
       reject(erro);
    });
  });
 });

 function excluirItem(element) {
  const clicar = element;
  clicar.remove();
  itensStorage();
}

 function remove(e) {
  const cartItem = e.target.parentNode.querySelectorAll('.cart__item');
  cartItem.forEach((element) => {
  excluirItem(element);
});
}
  
 const removeTodosItens = () => {
  const buttonRemove = document.getElementsByClassName('empty-cart')[0];
  buttonRemove.addEventListener('click', remove);
};

function addEvento() {
  const buttonElement = document.getElementsByClassName('item__add');
   for (let index = 0; index < buttonElement.length; index += 1) {
    buttonElement[index].addEventListener('click', function (e) {
      const btnEle = e.target.parentNode.getElementsByClassName('item__sku')[0];
    
      return fetchAdicionar(btnEle.innerText);
    });
    }
  }

const assicronas = async () => {
  createList(await fetchDataList());
  await addEvento();
  await loadStorage();
  await removeTodosItens();
};

window.onload = function onload() { 
  assicronas();
};
