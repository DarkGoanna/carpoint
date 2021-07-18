'use strict'
const html = document.querySelector('html');
const menu = document.querySelector('.header__menu');
const burger = document.querySelector('.header__burger');





// пространство между элементами меню для псевдоэлемента ::after
function calcEmptySpace() {
    const items = menu.querySelectorAll('li');
    let itemsTakeSpace = 0;

    items.forEach(li => {
        itemsTakeSpace += li.offsetWidth;
    })
    const emptySpaceAll = menu.offsetWidth - itemsTakeSpace;
    const halfEmptySpace = (emptySpaceAll / items.length) / 2;

    items.forEach(li => {
        li.style.setProperty('--empty', `-${halfEmptySpace}px`);
    })
}

// пересчитываем растояние
window.addEventListener('load', calcEmptySpace);
window.addEventListener('resize', calcEmptySpace);

// burger button
burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    html.classList.toggle('scroll-off');
});

// disable opened mobile menu on desktop
const desktopBreakpoint = 1000;
window.addEventListener('resize', () => {
    if (window.innerWidth > desktopBreakpoint) {
        burger.classList.remove('open');
        menu.classList.remove('open');
        html.classList.remove('scroll-off');
    }
});





// fixed header
const header = document.querySelector('.header');
const headerRow_1 = document.querySelector('.header__row_1');
const headerRow_2 = document.querySelector('.header__row_2');

// фиксим проваливание блока идущего после fixed header
function fixHeaderHeight() {
    header.nextElementSibling.style.paddingTop = `${header.clientHeight}px`;
}

// при загрузке пересчитываем высоту header
window.addEventListener('load', fixHeaderHeight);

// при ресайзе пересчитываем высоту header
window.addEventListener('resize', fixHeaderHeight);

/**
 * when you scrolling page down - first part of header go to up
 * when you scrolling page up - first part of header come back down
 */
let prevScrollPosition = window.pageYOffset;
const heightOfFirstPart = headerRow_1.offsetHeight
window.addEventListener('scroll', () => {
    const currentScrollPosition = window.pageYOffset;
    if (prevScrollPosition > currentScrollPosition) {
        header.style.top = "0";
    } else {
        header.style.top = `-${heightOfFirstPart}px`;
    }
    prevScrollPosition = currentScrollPosition;
});





// banner
if (document.querySelector('.banner')) {
    new Swiper('.banner', {
        speed: 1000,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.banner .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.banner .swiper-button-next',
            prevEl: '.banner .swiper-button-prev',
        },
    });
}





// section steps
const stepsCards = document.querySelectorAll('.steps__card');
if (stepsCards.length) {
    stepsCards.forEach(card => {
        card.addEventListener('click', () => {
            stepsCards.forEach(sibling => {
                sibling.querySelector('.steps__popup').classList.remove('open');
            });
            card.querySelector('.steps__popup').classList.add('open');
            html.classList.add('scroll-off');
        });
    });
}

// popup
const popups = document.querySelectorAll('.popup');
if (popups.length) {
    popups.forEach(popup => {
        popup.addEventListener('click', e => {
            e.stopPropagation();

            let flag = false;
            if (e.target.classList.contains('popup__wrapper')) {
                flag = true;
            } else if (e.target.classList.contains('popup__close')) {
                flag = true;
            }

            if (flag) {
                popup.classList.remove('open');
                html.classList.remove('scroll-off');

                if (popup.getAttribute('id') === 'video-popup') {
                    const iframe = popup.querySelector('iframe');

                    iframe.previousElementSibling.classList.add('pause');
                    iframe.previousElementSibling.setAttribute('data-src', 'https://www.youtube.com/embed/');
                    iframe.previousElementSibling.style.backgroundImage = '';
                    iframe.setAttribute('src', '');
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
                }
            }
        });
    });
}





// youtube videos
function initVideos() {
    for (let e = $('iframe'), t = 0; t < e.length; t++) {
        if (-1 === e[t].src.indexOf("enablejsapi")) {
            var n = -1 === e[t].src.indexOf("?") ? "?" : "&amp;";
            e[t].src += n + "enablejsapi=true"
        }
    }
}

function enableVideo(selector) {
    const video = document.querySelector(selector);
    if (video) {
        video.addEventListener('click', e => {
            const player = e.target;
            if (player.classList.contains('pause')) {
                player.classList.remove('pause');
                const iframe = player.nextElementSibling;
                iframe.setAttribute('src', player.getAttribute('data-src'));
                initVideos();
                iframe.addEventListener('load', () => {
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
                })
            }
        })
    }
}
enableVideo('.player');

// кнопки вызывающие popup
const popupCallers = document.querySelectorAll('.call-popup');
if (popupCallers.length) {
    popupCallers.forEach(caller => {
        const popupID = caller.getAttribute('data-popupName');
        const popup = document.querySelector(`#${popupID}`);
        caller.addEventListener('click', () => {
            popup.classList.add('open');
        })
    });
}





/**
 * tabs         - common class for tabs (string)          = '.className'
 * contentItems - common class for content items (string) = '.className'
 */
function enableTabs(tabs, contentItems) {
    // on page load - first tab and it's item must be active
    document.querySelector('button[data-tab="tab-1"]').classList.add('active');
    document.querySelector('#tab-1').classList.add('active');

    document.querySelectorAll(tabs).forEach(tab => {
        tab.addEventListener('click', () => {
            let current = tab.getAttribute('data-tab');

            //on click remove active class from siblings
            document.querySelectorAll(contentItems).forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll(tabs).forEach(tab => {
                tab.classList.remove('active');
            });

            // add active class to current tab and it's content item
            tab.classList.add('active');
            document.querySelector(`#${current}`).classList.add('active');
        })
    })
}

// tabs in section price
const priceTabs = document.querySelector('.price__card-wrapper');
if (priceTabs) {
    enableTabs('.price__tab', '.price-card');
}

// tabs in section reviews
const reviewsTabs = document.querySelector('.reviews__inner');
if (reviewsTabs) {
    enableTabs('.reviews__tab', '.reviews__content');
}





// btn "read more" in section seo
if (document.querySelector(".seo")) {
    const less = 'Свернуть';
    const more = 'Подробнее';
    const e = document.querySelector(".seo__text");

    if (e.offsetHeight > Number.parseInt(e.style.getPropertyValue('--height'))) {
        e.parentElement.insertAdjacentHTML("beforeend", '<button type="button" class="seo__btn"></button>');
        const t = document.querySelector(".seo__btn");

        e.classList.add("less");
        t.textContent = more;
        t.addEventListener("click", () => {
            e.classList.toggle("less");
            t.textContent = e.classList.contains('less') ? more : less;
        })
    }
}




// section models
const modelsSlider = document.querySelector('.models__slider');
if (modelsSlider) {
    new Swiper('.models__slider', {
        speed: 1000,
        loop: true,
        spaceBetween: 30,
        autoplay: {
            delay: 1000,
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                centeredSlides: true,
            },
            401: {
                slidesPerView: 3,
            },
            581: {
                slidesPerView: 4,
            },
            769: {
                slidesPerView: 6,
            },
            1201: {
                slidesPerView: 8,
            },
        },
    });
}





function getPlaylist(playlistID, quantityVideos = 10) {
    const result = [];
    const API = 'AIzaSyDWQ9VHKbmvicDUzePMB9pRT9RxotohyQ0';
    const requestURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,id&order=date&key=${API}&playlistId=${playlistID}&maxResults=${quantityVideos}`;

    fetch(requestURL)
        .then(response => response.json())
        .then((JSON) => {
            return JSON.items.forEach(item => {
                result.push({
                    thumbnails: item.snippet.thumbnails.standard.url,
                    date: item.snippet.publishedAt,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    id: item.snippet.resourceId.videoId,
                });
            })
        })
        .catch(error => console.log(error));
    return result;
}

// get current playlist id
// function parseURL(url) {
//     let regexp =
//       /https:\/\/www\.youtube\.com\/(?:watch\?v=(?:Ljb_qVG8UUU&list=PLCiVjAiT9q1IK40Gvkfnqa8GR2Fjzzy8v|hcI0FfW0MXU&list=RDhcI0FfW0MXU&start_radio=1)|playlist\?list=(PLCiVjAiT9q1I\-fFJAvcAlGDRavcflMiDJ))/
//     let match = url.match(regexp);
//     return match[1];
//   }

// add video-cards
document.querySelectorAll('.add-video-card').forEach(container => {
    const playlistID = container.getAttribute('data-playlistID');
    const quantity = +container.getAttribute('data-quantity');
    let data = getPlaylist(playlistID, quantity);
    let card;

    setTimeout(() => {
        data.forEach(item => {
            card = `<div class="swiper-slide">
                        <div class="video-card" data-videoID="${item.id}">
                            <div class="video-card__image">
                                <a href="https://www.youtube.com/embed/${item.id}" data-fancybox>
                                    <img src="${item.thumbnails}" alt="${item.title}">
                                </a>
                            </div>
                            <div class="video-card__title title-3">${item.title}</div>
                        </div>
                    </div>`;
            container.insertAdjacentHTML('beforeend', card);
        });

        // reviews slider
        const reviewsSlider = document.querySelector('.reviews-youtube__slider');
        if (reviewsSlider) {
            new Swiper('.reviews-youtube__slider', {
                loop: true,
                spaceBetween: 30,
                slidesPerView: 3,

                breakpoints: {
                    320: {
                        slidesPerView: 1,
                    },
                    581: {
                        slidesPerView: 2,
                    },
                    769: {
                        slidesPerView: 3,
                    },
                    1000: {
                        slidesPerView: 2,
                    },
                    1200: {
                        slidesPerView: 3,
                    },
                },
            });
        }
    }, 500);
})

// // get video id
// function youtubeParser(url){
//     var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
//     var match = url.match(regExp);
//     return (match&&match[7].length==11)? match[7] : false;
// }

// // simple-block video
// const simpleBlock = document.querySelector('.simple-block__player-wrapper');
// if (simpleBlock) {
//     const player = simpleBlock.querySelector('.player');
//     const videoID = youtubeParser( player.getAttribute('data-url'));
//     const imgURL = `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`;
//     const src = `https://www.youtube.com/embed/${videoID}`;

//     player.setAttribute('data-src', src);
//     player.style.backgroundImage = `url(${imgURL})`;
// }