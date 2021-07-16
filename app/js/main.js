// меню
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.menu');
const html = document.querySelector('html');

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    html.classList.toggle('scroll-off');
});

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

// при скролле
let prevScrollPosition = window.pageYOffset;
const headerHeight = headerRow_1.offsetHeight
window.onscroll = function() {
  const currentScrollPosition = window.pageYOffset;
  if (prevScrollPosition > currentScrollPosition) {
    header.style.top = "0";
  } else {
    header.style.top = `-${headerHeight}px`;
  }
  prevScrollPosition = currentScrollPosition;
}

// при ресайзе пересчитываем высоту header
window.addEventListener('resize', fixHeaderHeight);

// is Apple
function isApple() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}

window.addEventListener('load', () => {
    if (isApple()) document.querySelector('html').classList.add('ios');
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
// steps
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
            if ( e.target.classList.contains('popup__wrapper') ) {
                flag = true;
            } else if ( e.target.classList.contains('popup__close') ) {
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

// видео с ютуба
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
    if(video) {
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

// price tabs
window.addEventListener('load', () => {
    document.querySelector('button[data-tab="tab-1"]').classList.add('active');
    document.querySelector('#tab-1').classList.add('active');
})
document.querySelectorAll('.price__tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.price-card').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.price__tab').forEach(tab => {
            tab.classList.remove('active');
        });

        let current = tab.getAttribute('data-tab');

        tab.classList.add('active');
        document.querySelector(`#${current}`).classList.add('active');
    })
})
// reviews tabs
document.querySelectorAll('.reviews__tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.reviews__content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.reviews__tab').forEach(tab => {
            tab.classList.remove('active');
        });

        let current = tab.getAttribute('data-tab');

        tab.classList.add('active');
        document.querySelector(`#${current}`).classList.add('active');
    })
})

// btn "read more" in seo
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
    // const playlistID = parseURL( container.getAttribute('data-playlistURL') );
    const playlistID = container.getAttribute('data-playlistID');
    const quantity = +container.getAttribute('data-quantity');
    let data = getPlaylist(playlistID, quantity);
    let card;
      
    setTimeout(()=> {
        data.forEach(item => {
            if ( container.classList.contains('reviews-youtube__slider-inner') ) {
                card = `<div class="swiper-slide">
                            <div class="video-card call-popup" data-popupName="video-popup" data-videoID="${item.id}">
                                <picture class="video-card__image">
                                    <img src="${item.thumbnails}" alt="${item.title}">
                                </picture>
                                <div class="video-card__title title-3">${item.title}</div>
                            </div>
                        </div>`;
            } else {
                card = `<div class="video-card call-popup" data-popupName="video-popup" data-videoID="${item.id}">
                            <picture class="video-card__image">
                                <img src="${item.thumbnails}" alt="${item.title}">
                            </picture>
                            <div class="video-card__title title-3">${item.title}</div>
                        </div>`;
            }
            container.insertAdjacentHTML('beforeend', card);
        });

        const popupCallers = document.querySelectorAll('.add-video-card .call-popup');
        if (popupCallers.length) {
            popupCallers.forEach(caller => {
                const popupID = caller.getAttribute('data-popupName');
                const popup = document.querySelector(`#${popupID}`);
                caller.addEventListener('click', () => {
                    popup.classList.add('open');
                    html.classList.add('scroll-off');

                    if (popup.getAttribute('id') === 'video-popup') {
                        const videoID = caller.getAttribute('data-videoID');
                        const src = `https://www.youtube.com/embed/${videoID}`;
                        const imgURL = `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`;
                        const title = caller.querySelector('.video-card__title').textContent;


                        popup.querySelector('.player').setAttribute('data-src', src);
                        popup.querySelector('.player').style.backgroundImage = `url(${imgURL})`;
                        popup.querySelector('.popup__title').textContent = title;
                        enableVideo('#video-popup .player');
                    }
                });
            });
        }

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

// get video id
function youtubeParser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

// simple-block video
const simpleBlock = document.querySelector('.simple-block__player-wrapper');
if (simpleBlock) {
    const player = simpleBlock.querySelector('.player');
    const videoID = youtubeParser( player.getAttribute('data-url'));
    const imgURL = `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`;
    const src = `https://www.youtube.com/embed/${videoID}`;

    player.setAttribute('data-src', src);
    player.style.backgroundImage = `url(${imgURL})`;
}
1