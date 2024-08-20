/** 카테고리 swiper */
export const swiperCategory = () => {
    const swiper = new Swiper('.swiper-container', {
        // slidesPerView: auto,
        spaceBetween: 20,
        freeMode: true,
        breakpoints: {
            768: {
            slidesPerView: 4,
            },
            1024: {
                slidesPerView: 6,
            },
        },
        reachEnd: function () {
            swiper.allowSlideNext = false;
        },
    });
}