/**
 * Класс отображения товаров на странице корзины.
 */
class CartProduct {
    /**
     * DTO
     * @param source - источник в котором хранятся все товары (файл *.json).
     * @param {HTMLElement} container - контейнер в котором будут лежать все товары.
     */
    constructor(source, container = '.product-details') {
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
                    this._render(product);
                    this._renderSum();
                }
            });
    }

    /**
     * Метод, отображающий общую сумму товаров.
     */
    _renderSum() {
        // в общую сумму положим сумму товаров в корзине.
        $('.grandtotal-grand-span').text(`$ ${this.amount}`);
        $('.grandtotal-sub-span').text(`$ ${this.amount}`);

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
     * Метод создания DOM-структуры для товара.
     * @param {object} product - обьект с товаром из json файла.
     */
    _render(product) {
        // общий <div> товара.
        let $container = $(`<div class="product-details-items" data-id-product="${product.id_product}"></div>`);

        // <div> с изображением, названием, цветом и размером товара.
        let $itemsAbout = $(`<div class="items-about"></div>`);
        $itemsAbout.append($(`<img src="${product.src}" alt="ShoppingCart1" class="items-about-img">`));
        let $itemsAboutText = $(`<div class="items-about-text"></div>`);
        $itemsAboutText.append($(`<a class="items-about-text-p1" href="singlpage.html">${product.product_name}</a>`));
        let $spanColor = $(`<span class="items-about-text-span">${product.color}</span>`);
        let $pColor = $(`<p class="items-about-text-p2">Color: </p>`);
        $pColor.append($spanColor);
        $itemsAboutText.append($pColor);
        let $spanSize = $(`<span class="items-about-text-span">${product.size}</span>`);
        let $pSize = $(`<p class="items-about-text-p3">Size:</p>`);
        $pSize.append($spanSize);
        $itemsAboutText.append($pSize);
        $itemsAboutText.appendTo($itemsAbout);
        $itemsAbout.appendTo($container);

        // <div> со стоимостью за еденицу товара.
        $container.append($(`<div class="unite">$${product.price}</div>`));

        // <div> с количеством товара.
        let $quantity = $(`<div class="quantity"></div>`);
        let $quantityP = $(`<p class="quantity-p">${product.quantity}</p>`);
        let $plus = $(`<button class="plus">+</button>`);
        let $minus = $(`<button class="minus">-</button>`);
        $quantity.append($minus);
        $quantity.append($quantityP);
        $quantity.append($plus);
        $container.append($quantity);

        // <div> с правилом доставки товара.
        $container.append($(`<div class="shipping">FREE</div>`));

        // <div> с общей стоимтостью товара.
        let $subtotal = $(`<div class="subtotal">$${product.price}</div>`)
        $container.append($subtotal);

        // Кнопка - удалить товар.
        let $del = $(`<button class="product-details-items-del">X</button>`);
        $container.append($del);

        // Добавление товара на страницу.
        let $hr = $(`<hr data-id-hr="${product.id_product}">`);
        $container.appendTo(this.container);
        $hr.appendTo(this.container);

        // Вешаем обработчик на кнопку удалить.
        $del.on('click', e => {
            // Получаем родительский DOM-элемент кнопки удалить.
            let $parent = $(e.target).closest('.product-details-items');

            // Получаем из кнопки идентификатор товара с которым работаем.
            let productId = +$parent.data('id-product');

            // Вызываем метод удаления товара.
            this._remove(productId);
        });

        // Вешаем обработчик на кнопку $plus (плюс один товар).
        $plus.on('click', e => {
            product.quantity++;
            $quantityP.text(`${product.quantity}`);
            $subtotal.text(`$${product.quantity * product.price}`);
            this.countGoods++;
            this.amount += product.price;
            this._renderSum();
        });

        // Вешаем обработчик на кнопку $minus (минус один товар).
        $minus.on('click', e => {
            if (+$quantityP.text() <= 1) {
                $quantityP.text(1);
            } else {
                product.quantity--;
                $quantityP.text(`${product.quantity}`);
                $subtotal.text(`$${product.quantity * product.price}`);
                this.countGoods--;
                this.amount -= product.price;
                this._renderSum();
            }
        });
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