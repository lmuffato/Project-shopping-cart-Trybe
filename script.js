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

const addComputers = (id) => (new Promise((resolve) => {
  // Como recuperar dados de uma API usando promises no javascript: https://www.youtube.com/watch?v=v9JVA6tVmcg&ab_channel=EmersonBroga
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => resolve(data));
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

function cartItemClickListener(event) {
  const itemsCart = document.getElementsByClassName('cart__items');
  // Como remover elementos filhos de um elemento principal: https://www.w3schools.com/jsref/met_node_removechild.asp#:~:text=The%20removeChild()%20method%20removes,longer%20part%20of%20the%20DOM.
  itemsCart[0].removeChild(event.target);

  const variavel = JSON.parse(localStorage.getItem('listCar'));
  const itemSelected = (event.target).innerText;
  const atualCar = variavel.filter((elementRemove) => {
    if (!itemSelected.includes(elementRemove.sku)) {
     return true;
    }
    return false;
  });
  localStorage.setItem('listCar', JSON.stringify(atualCar));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addComputerCartClick = (event) => {
  // Como recuperar o elemento pai do elemento que eu estou usando: w3schools.com/jsref/prop_node_parentnode.asp
  const computerSelected = event.target.parentNode;
  const itemsCart = document.getElementsByClassName('cart__items');
  // Como recuperar os elementos filhos de um elemento principal: https://www.w3schools.com/jsref/prop_node_childnodes.asp
  addComputers(computerSelected.childNodes[0].innerText)
    .then((computers) => {
      const newItem = { sku: computers.id, name: computers.title, salePrice: computers.price,
      };
      const item = createCartItemElement(newItem);
      itemsCart[0].appendChild(item);
      const variavel = JSON.parse(localStorage.getItem('listCar'));
      if (variavel !== null) {
        variavel.push(newItem);
        localStorage.setItem('listCar', JSON.stringify(variavel));
      } else {
        localStorage.setItem('listCar', JSON.stringify([newItem]));
      }      
    });
};

function refreshCar() {
  const itemCar = JSON.parse(localStorage.getItem('listCar'));
  const sectionCart = document.getElementsByClassName('cart__items');

  if (itemCar != null) {
    itemCar.forEach((computer) => {
      const item = createCartItemElement({
        sku: computer.sku, 
        name: computer.name, 
        salePrice: computer.salePrice,
      });
    sectionCart[0].appendChild(item);
    });
  }
}

function includeComputerCar() {
  const sectionItems = document.getElementsByClassName('items');
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
        const buttons = document.getElementsByClassName('item__add');
        for (let index = 0; index < buttons.length; index += 1) {
          const button = buttons[index];
          button.addEventListener('click', addComputerCartClick);
        }
      })
    );
}

function clearCar() {
  const listCar = document.querySelector('.cart__items');
  // Como deletar todos os filhos do elemento de uma vez: https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  while (listCar.firstChild) {
    listCar.removeChild(listCar.lastChild);
  }
  localStorage.clear();
}

window.onload = function onload() { 
  refreshCar();
  includeComputerCar();
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', clearCar);
};

// Referências:
// Repositórios consultados para entender como usar as promisses e fazer o requisito 1: 
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/119/commits/6a52ec57dbfc0d5f2ba34bb96c7090f692fd0e5d
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/104/commits/2426adac2d023b4ff5e5634dd51d4f86ae02cfb0
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/117/commits/063c01155cecdc7690490f347c0241458eb864b2
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/109/commits/d17d596a4eaec6d637755c0ff5c88904dc4334bc
