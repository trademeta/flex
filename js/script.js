$('.flexslider').flexslider({
    animation:'slide',
    directionNav: true
});

var cartCount = 0,
    cart = $('.cart'),
    countCart=$('.count-cart'),
    cartContainer=$('.cart-container'),
    w = $(window).width(),
    page=$('.page');

//Обработчик кнопки добавления товара в корзину
$('.cart-block button').on('click',function(e) {
    var parent = $(this).closest('.grid'),
        img = parent.find('.img img:first'),
        imgCoord = img.offset(),
        cloneImg = img.clone(),
        price = parent.find('.new-price span').html(),
        title = parent.find('.title').html(),
        txtTitle=parent.find('.title h5').html(),
        h5 = !!cartContainer.find('h5').length,
        ret=false;
    if(h5){
        cartContainer.find('h5').each(function(i,el) {
            var $this=$(this),
                textH5 = $(this).html();
            if(textH5==txtTitle) {
                cartPlus($this);
                ret=true;
                return false;
            }
        });
        if(!ret) {
            cartCount++;
            countCart.html(cartCount);
            cartContainer.find('ul').append('<li data-price="'+price+'"><div class="cart-left"><img src="img/cart.png" alt=""></div><div class="cart-right">' + title + '<div class="amount"><span class="minus">-</span><span class="col">1</span><span class="plus">+</span></div><div class="cart-price">'+price+' грн</div></div></li>');
        }
    }else{
        cartCount++;
        countCart.html(cartCount);
        cartContainer.find('ul').append('<li data-price="'+price+'"><div class="cart-left"><img src="img/cart.png" alt=""></div><div class="cart-right">' + title + '<div class="amount"><span class="minus">-</span><span class="col">1</span><span class="plus">+</span></div><div class="cart-price">'+price+' грн</div></div></li>');
    }
    var cartCoord = cart.offset();
    cloneImg.addClass('clone-img').appendTo('body').css({
        'top': imgCoord.top,
        'left': imgCoord.left
    }).animate({
        'top': cartCoord.top,
        'left': cartCoord.left,
        'width': cloneImg.width()/7,
        'height': cloneImg.height()/7
    }, 2000,function() {
        cloneImg.fadeOut(500);
    });
});
cartContainer.on('click','.minus', function(e) {
    e.stopPropagation();
    cartMinus($(e.target));
});
cartContainer.on('click','.plus', function(e) {
    e.stopPropagation();
    cartPlus($(e.target));
});
//Группировка цифр по разрядам
function cart_group_price(intprice){
    var result_total = intprice.toString();
    var lengthofstr = result_total.length, groupprice;
    switch (lengthofstr){
        case 4:
            groupprice = result_total.substring(0,1)+' '+result_total.substring(1,4);
            break;
        case 5:
            groupprice = result_total.substring(0,2)+' '+result_total.substring(2,5);
            break;
        case 6:
            groupprice = result_total.substring(0,3)+' '+result_total.substring(3,6);
            break;
        default:
            groupprice = result_total;
    }
    return groupprice;
}
function cartMinus(th) {
    var $this = th,
        parentLi = $this.closest('li'),
        col=parentLi.find('.col'),
        productPrice=parseInt(parentLi.data('price').replace(/\D+/g,"")),
        cartPrice=parentLi.find('.cart-price'),
        currentProductPrice=parseInt(cartPrice.html().replace(/\D+/g,"")),
        currentCol = col.html();
    if(currentCol>0){
        currentCol--;
        cartCount--;
        currentProductPrice-=productPrice;
        cartPrice.html(cart_group_price(currentProductPrice)+' грн');
        countCart.html(cartCount);
        col.html(currentCol);
    }
}
function cartPlus(th) {
    var $this = th,
        parentLi = $this.closest('li'),
        col=parentLi.find('.col'),
        productPrice=parseInt(parentLi.data('price').replace(/\D+/g,"")),
        cartPrice=parentLi.find('.cart-price'),
        currentProductPrice=parseInt(cartPrice.html().replace(/\D+/g,"")),
        currentCol = col.html();

    currentCol++;
    cartCount++;
    currentProductPrice+=productPrice;
    cartPrice.html(cart_group_price(currentProductPrice)+' грн');
    countCart.html(cartCount);
    col.html(currentCol);
}

//Клик по корзине
cart.on('click',function(e) {
    var target = $(e.target);
    !target.closest('.cart-container').length && cartContainer.find('li').length && cartContainer.slideToggle(500);
});

//Наведение курсора на пункт меню
var aside=$('.aside'),
    asideTop=aside.offset().top,
    asideContent=$('.aside__content'),
    asideContentTop=asideContent.offset().top,
    mainUl = $('.main-ul'),
    menuOverlay = $('.menu-overlay'),
    header = $('.header'),
    grids=$('.products .grid');

mainUl.on('mouseenter',function(e){
    var offsetTop= w>=1210? asideContentTop-asideTop : header.height();
    menuOverlay.css({
        'top':  offsetTop+'px',
        'height': parseInt(page.css('height')) + 'px'
    }).show();
}).on('mouseleave',function(e){
    menuOverlay.hide();
});

//Клик по стрелке в блоке с товаром
$('.img-left').on('click',function(e) {
    var parent = $(this).closest('.grid'),
        colors = parent.find('.colors'),
        check=colors.find('input:checked');
    check.index() < colors.find('input').length-1 && check.prop('checked',false) && check.next('input').prop('checked', true);
});
$('.img-right').on('click',function(e) {
    var parent = $(this).closest('.grid'),
        colors = parent.find('.colors'),
        check=colors.find('input:checked');
    check.index() > 0 && check.prop('checked',false) && check.prev('input').prop('checked', true);
});


if(w<1210) {
    grids.find('.img img').each(function(i,e) {
        var imgWidth = $(this).width();
        $(this).css('width', imgWidth * 0.8);
    });
    $('.header__right').before($('aside,.menu-overlay'));
    $('.aside__nav').on('click',function(e) {
        $('.aside__content .main-ul').slideToggle(500);
    });
    asideContent=$('.aside__content'),
    mainUl=$('.main-ul');
    asideContent.find('li a').on('click', function(e) {
        var tg = $(e.target),
            target = tg.closest('li'),
            list = target.closest('ul');
        if(target.find('ul:first').length){
            list.find("li>ul").addClass("close");
            $(".main-ul>li>ul>li>ul ul").removeClass("close");
            target.find('ul:first').removeClass("close").slideToggle(500);
            list.find("ul.close").slideUp(500)
        };
    });
    $('.header__left').on('click',function(e) {
        $(this).find('ul').slideToggle(500);
    });
    $('.flexslider').after($('.content__nav'));
}
if(w<500) {
    grids.find('.img img').each(function(i,e) {
        var imgWidth = $(this).width();
        $(this).css('width', imgWidth * 0.7);
    });
}