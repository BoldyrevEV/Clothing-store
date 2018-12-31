/**
 * Инициализация.
 */
$(document).ready(() => {
    // Товары.
    let product = new Product('js/getProduct.json');
    product.init();

    // Большая корзина.
    let cartProduct = new CartProduct('js/getCart.json');
    cartProduct.init();

    // Товары для мужчин.
    let productForMen = new Product('js/getProductForMen.json', '.product-items-container');
    productForMen.init();

    // Корзина.
    let cart = new SmallCart('js/getCart.json');
    cart.init();

    // Добавление в корзину на странице index.
    $('.items-shop').on('click', e => {
        let $parent = $(e.target).closest('.addCart');
        cart.addProduct($parent);
    });

    // Добавление в корзину на странице product.
    $('.product-items-container').on('click', e => {
        let $parent = $(e.target).closest('.addCart');
        cart.addProduct($parent);
    });

    // Отзывы.
    let feedback = new Feedback('js/getFeedback.json');
    feedback.init();
});