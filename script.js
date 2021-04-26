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

const fetchAPI = async () => {
  const fetchURL = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = fetchURL.json();
  return response;
};

const createComputerList = async () => {
  const showData = await fetchAPI();
  const { results } = showData;
  results.forEach((element) => {
    const obj = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const itemsSection = document.querySelector('.items');
    itemsSection.appendChild(createProductItemElement(obj));
  });
};
  
  function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
  }
  
  // function cartItemClickListener(event) {
    
  // }
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    // li.addEventListener('click', cartItemClickListener);
    return li;
  }

  const computerById = async (id = 'MLB1341706310') => {
    const endpoint = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const response = endpoint.json();
    return response;
  };

  const addTargetToCart = async () => {
    const getButtons = [...document.querySelectorAll('.item__add')];
    getButtons.forEach((element) => {
      element.addEventListener('click', async (event) => {
        const targetSection = event.target.parentNode;
        const targetID = getSkuFromProductItem(targetSection);
        const data = await computerById(targetID);
        const getCartItems = document.querySelector('.cart__items');
        const obj = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        getCartItems.appendChild(createCartItemElement(obj));
      });
    });
  };

  const syncro = async () => {
    try {
      await createComputerList();
      await addTargetToCart();
    } catch (error) {
      console.log('Error! Something is wrong!');
    }
  };
  
  window.onload = function onload() {
    syncro();
   };
