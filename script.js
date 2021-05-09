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
  
  const putCartItemsIntoLocalStorage = () => {
    const getCartList = [...document.querySelectorAll('.cart__item')];
    const cartObjArr = getCartList.map((cartElement, index) => {
      const getElementContent = cartElement.innerHTML;
      const cartObj = {
        [index]: getElementContent,
      };
      return cartObj;
    });
    cartObjArr.forEach((cartObj, index) =>
      localStorage.setItem(`cartItem${[index + 1]}`, JSON.stringify(cartObj)));
  };
  
  function cartItemClickListener(event) {
    const elementToBeRemoved = event.target;
    elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
    localStorage.clear();
    return putCartItemsIntoLocalStorage();
  }
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }

  const removeLoading = () => {
    const getLoadingElement = document.querySelector('.loading');
    getLoadingElement.remove();
  };

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
        putCartItemsIntoLocalStorage();
      });
    });
  };

  const getLocalStorage = () => {
    for (let index = 1; index <= localStorage.length; index += 1) {
      const retrieveCartItem = localStorage.getItem(`cartItem${index}`);
      const cartItemToObj = JSON.parse(retrieveCartItem);
      const splitItemStr = cartItemToObj[index - 1].split(' | ');
      const skuValue = splitItemStr[0].split('SKU: ')[1];
      const nameValue = splitItemStr[1].split('NAME: ')[1];
      const priceValue = splitItemStr[2].split('$')[1];
      const cartList = document.querySelector('ol');
      const obj = {
        sku: skuValue,
        name: nameValue,
        salePrice: priceValue,
      };
      cartList.appendChild(createCartItemElement(obj));
    }
  };

  const clearButton = () => {
    const getClearBtn = document.querySelector('.empty-cart');
    getClearBtn.addEventListener('click', () => {
      const cartList = document.querySelector('ol');
      cartList.innerHTML = '';
      localStorage.clear();
    });
  };

  const syncro = async () => {
    try {
      await createComputerList();
      await addTargetToCart();
      removeLoading();
    } catch (error) {
      console.log('Error! Something is wrong!');
    }
  };
  
  window.onload = function onload() {
    syncro();
    getLocalStorage();
    clearButton();
   };
