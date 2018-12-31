/**
 * Класс выпадающей корзины.
 */
class SmallCart {

    /**
     * DTO.
     * @param source - источник в котором хранятся существующие товары в корзине (файл *.json).
     * @param container - контейнер для корзины (блок с классом basket-menu-smallCart).
     */
    constructor(source, container = '.basket-menu-smallCart') {
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее количество товаров в корзине.
        this.amount = 0; // Общее стоимость товаров в корзине.
        this.cartItems = []; // Массив со всеми товарами.
    }

    /**
     * Метод инициализации товаров.
     */
    init() {
        // Обрабатываем ajax запрос.
        fetch(this.source)
            .then(result => result.json())

            .then(data => {
                for (let product of data.contents) {
                    this.cartItems.push(product);
                    this.amount += product.price; // подсчет общей стоимости товаров.
                    this.countGoods++; // увеличили общее количество товаров.
                    this._renderItem(product);
                    this._renderSum();
                }
            });
    }

    /**
     * Метод, отображающий общую сумму товаров.
     */
    _renderSum() {
        // в .basket-menu-total__text2 (общая сумма) положим сумму товаров в корзине.
        $('.basket-menu-total__text2').text(`$ ${this.amount}`);

        if (document.querySelector('.basket__none')) {
            // блоку с количеством покупоп над корзиной присвоим class basket__quantity.
            let basketQuantity = document.querySelector('.basket__none');
            basketQuantity.classList.remove('basket__none');
            basketQuantity.classList.add('basket__quantity');
        }

        // в блок с количеством покупоп положим количество товаров в this.countGoods.
        $('.basket__quantity').text(`${this.countGoods}`);
    }

    /**
     * Метод отображение товаров в корзине.
     * @param {object} product - обьект с товаром.
     */
    _renderItem(product) {
        // общий <div> товара в корзине.
        let $container = $('<div/>', {
            class: 'basket-menu-product',
            'data-id-product': product.id_product,
        });

        let $containerIn = $('<div/>');
        let $containerP1 = $('<p class="basket-menu-product__icon">');
        let $containerP2 = $('<p class="basket-menu-product__quantity">');
        let $hr = $(`<div class="basket-menu-hr" data-id-hr="${product.id_product}"></div>`);

        // Создали кнопку удалить.
        let $removeBtn = $('<button class="delBtn">x</button>');

        $container.append($(`<img class="basket-menu-product__img" src="${product.src}">`));
        $container.append($containerIn);
        $containerIn.append($(`<a class="basket-menu-product__rebox" href="#">${product.product_name}</a>`));
        $containerIn.append($containerP1);
        $containerP1.append($(`<i class="fas fa-star"></i>`));
        $containerP1.append($(`<i class="fas fa-star"></i>`));
        $containerP1.append($(`<i class="fas fa-star"></i>`));
        $containerP1.append($(`<i class="fas fa-star"></i>`));
        $containerP1.append($(`<i class="fas fa-star-half-alt"></i>`));
        $containerIn.append($containerP2);

        $container.append($removeBtn); // Добавили кнопку удалить.

        $containerP2.text(`${product.quantity} х $${product.price}`);
        $container.appendTo(this.container);
        $hr.appendTo(this.container);

        // Вешаем обработчик на кнопку удалить.
        $removeBtn.on('click', e => {
            // Получаем родительский DOM-элемент кнопки удалить.
            let $parent = $(e.target).closest('.basket-menu-product');

            // Получаем из кнопки идентификатор товара с которым работаем.
            let productId = +$parent.data('id-product');

            // Вызываем метод удаления товара.
            this._remove(productId);
        });
    }

    /**
     * Метод обновления корзины.
     * @param {object} product - обьект с товаром.
     */
    _updateCart(product) {
        // Найдем контейнер DOM-струтуры для product.
        let $container = $(`div[data-id-product="${product.id_product}"]`);

        // В блоке с информацией по количеству product обновим количество.
        $container.find('.basket-menu-product__quantity').text(`${product.quantity} х $${product.price}`);
    }

    /**
     * Метод добавления товара в корзину.
     * @param element - кнопка купить на элементе продукта
     */
    addProduct(element) {
        // Получаем из кнопки идентификатор товара с которым работаем.
        let productId = +element.data('id');

        let find = this.cartItems.find(product => product.id_product === productId);

        if (find) { // если товар был в корзине.
            find.quantity++; // увеличили количество.
            this.countGoods++; // увеличили общее количество товаров.
            this.amount += find.price; // увеличили общую стоимость.
            this._updateCart(find); // обновили корзину.
            this._renderSum();

        } else { // если товара небыло в корзине.
            // формируем структуру для нового товара.
            let newProduct = {
                id_product: +element.data('id'),
                product_name: element.data('title'),
                price: +element.data('price'),
                src: element.data('src'),
                quantity: 1
            };

            this.cartItems.push(newProduct);
            this.amount += newProduct.price; // подсчет общей стоимости товаров.
            this._renderItem(newProduct)
            this.countGoods++; // увеличили общее количество товаров.
            this._renderSum();
        }
    }

    /**
     * Метод удаления товара из корзины.
     * @param idProduct - идентификатор товара.
     */
    _remove(idProduct) {
        // Находим товар в корзине с идентификатором idProduct.
        let removeElem = this.cartItems.find(product => product.id_product === idProduct);

        if (removeElem.quantity !== 1) { // если товар есть в корзине.
            removeElem.quantity--;
            this.countGoods--;
            this.amount -= removeElem.price;
            this._updateCart(removeElem);

        } else { // если товара небыло в корзине.
            for (let i = 0; i < this.cartItems.length; i++) {
                if (this.cartItems[i] === removeElem) {
                    this.cartItems.splice(i, 1);
                }
            }

            // удаляем товар из корзины
            $(`[data-id-product=${removeElem.id_product}]`).remove();
            $(`[data-id-hr=${removeElem.id_product}]`).remove();

            this.countGoods--;
            this.amount -= removeElem.price;
        }

        this._renderSum();

        if (this.cartItems.length === 0) {
            // блоку с количеством покупоп над корзиной присвоим class basket__none.
            let basketQuantity = document.querySelector('.basket__quantity');
            basketQuantity.classList.remove('basket__quantity');
            basketQuantity.classList.add('basket__none');
        }
    }
}