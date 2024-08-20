import { API_KEYS } from './config/apiKey.js';
import { createPagination } from './js/pagination.js';
import { setLocationMap } from './js/kakaoMap.js';
import { swiperCategory } from './js/swiper.js';

// ================================================
//  variables
// ================================================
/** API request */
const seoulApiKey = API_KEYS.SEOUL_EDU_KEY;
const API_URL = `http://openAPI.seoul.go.kr:8088/${seoulApiKey}/json/ListPublicReservationEducation/`;
const apiParams = {
    startIndex: 1,
    endIndex : 15,
    minClassNm : '',    //소분류명
    svcNm : '',         //서비스명
    useTgtInfo : '',    //서비스대상 (not use)
    areaNm : ''         //지역명
};

/** elements */
const $category = document.querySelectorAll('.category');
const $listCon = document.getElementById('listCon');
const $detailArea = document.getElementById('detailArea');
const $contentList = document.querySelector('.content-list');
const $searchBtn = document.getElementById('searchBtn');
const $searchInput = document.getElementById('searchInput');
const $cityList = document.getElementById('cityList');
const $pagination = document.getElementById('pagination');
const $loading = document.getElementById('loadingView');
// mobile
const $hamBtn = document.getElementById('hamburgerBtn');
const $closeBtn = document.querySelectorAll('.close-btn');

/** pagination */
let currentPage = 1;
let pageGroup = 1;

/** flag */
const isMobile = window.innerWidth <= 768;
let isLoading = false;

// ================================================
//  function
// ================================================

/** 공공 서비스 api 연결 */
const fetchPublicService = async () => {
    try {
        isLoading = true;
        showLoading(isLoading);

        const params = Object.values(apiParams);

        // 요청 URL 생성
        const apiConnect = API_URL + params.map((item) => (item === '' ? '%20' : item)).join('/');

        const response = await fetch(apiConnect);
        if (!response.ok) {
            throw new Error('Network Error');
        }

        const data = await response.json();
        const result = data.RESULT || data.ListPublicReservationEducation.RESULT;
        // 정상코드가 아닐 경우 return
        if (result.CODE !== 'INFO-000') {
            console.log(`api response :: ${result.MESSAGE}`)
            return '';
        }

        const dataList = data.ListPublicReservationEducation;
        return dataList;

    } catch (e) {
        console.error('fetch error : ' + e);
    } finally {
        isLoading = false;
        showLoading(isLoading);
    }
};

/** 리스트 생성 */
const createServiceList = async () => {
    if (isLoading) return;

    const list = await fetchPublicService();
    if (list) {
        let htmlStr = '';
        const listItem = list.row;

        const statusColor = {
            접수중: 'blue', 안내중: 'blue', 일시중지: 'orange', 예약마감: 'gray', 접수종료: 'gray'
        };

        listItem.forEach((elm) => {
            htmlStr += `
                <li class='list' data-status='${elm.SVCSTATNM}'>
                    <div class='status ${statusColor[elm.SVCSTATNM]}'>${elm.SVCSTATNM}</div>
                    <img class='img-area' src='${elm.IMGURL}' alt='이미지'>
                    <div class='text-area' data-detailcont='${elm.DTLCONT}' data-svcurl='${elm.SVCURL}' data-lng='${elm.X}' data-lat='${elm.Y}'>
                        <p class='title'>${elm.SVCNM}</p>
                        <span class='target'>${elm.USETGTINFO}</span>
                        <span class='location'>${elm.PLACENM}</span>
                        <span class='date'>${elm.SVCOPNBGNDT.split(' ')[0]} ~ ${elm.SVCOPNENDDT.split(' ')[0]}</span>
                    </div>
                </li>
            `;
        });
        $listCon.innerHTML = htmlStr;

        const totalCnt = list.list_total_count;
        $pagination.innerHTML = createPagination(totalCnt, currentPage);
    } else {
        $listCon.innerHTML = '관련 데이터가 없습니다.';
        $pagination.innerHTML = '';
    }
};


/** 카테고리 변경 */
const changeCategory = (category) => {
    // 소분류명 설정
    apiParams.minClassNm = category === '전체' ? '' : category;
    createServiceList();
};

/** 검색 */
const searchService = (areaVal, srvVal) => {
    // 지역명, 서비스명 설정
    apiParams.areaNm = areaVal;
    apiParams.svcNm = srvVal;
    createServiceList();
};

/** 서비스 상세보기 */
const detailService = (url, cont) => {
    const $detailText = isMobile
        ? document.getElementById('detailTextModal') : document.getElementById('detailText');
    const $reserveBtn = isMobile
        ? document.getElementById('reserveBtnModal') : document.getElementById('reserveBtn');

    $detailText.scrollTop = 0;

    // 상대경로 img 태그 제거
    const newCont = cont.replace(/<img[^>]*>/g, '');

    $detailText.innerHTML = newCont;
    $reserveBtn.setAttribute('href', url);
    $detailArea.classList.add('on');
};

/** 리스트 페이지 이동 */
const moveListPage = (pageIndex) => {
    // 인덱스 설정
    apiParams.startIndex = (pageIndex - 1) * 15 + 1;
    apiParams.endIndex = pageIndex * 15;
    currentPage = pageIndex;
    createServiceList();
}

/** 아이템 초기화 */
const itemInit = (resetApiParams) => {
    // 상세 영역 활성화 해제
    $detailArea.classList.remove('on');
    // 리스트 스크롤 상단
    $contentList.scrollTop = 0;
    // 지도 초기화
    setLocationMap();

    // api 요청인자 초기화
    if (resetApiParams) {
        apiParams.startIndex = 1;
        apiParams.endIndex = 15;
        apiParams.minClassNm = '';
        apiParams.svcNm = '';
        apiParams.useTgtInfo = '';
        apiParams.areaNm = '';
    }
}

/** 로딩바 */
const showLoading = (isLoading) => {
    $loading.style.display = isLoading ? 'flex' : 'none';
}

/** 초기화 */
const init = () => {
    // 전체 카테고리 선택
    document.getElementById('all').click();
    // 지도 설정
    setLocationMap();
    // swiper 설정
    swiperCategory();
};

// ================================================
//  event
// ================================================
/** 카테고리 선택 */
$category.forEach((item) => {
    item.addEventListener('click', (e) => {
        // 아이템 초기화
        itemInit(true);

        // 클릭한 카테고리 활성화
        const activeItem = e.target.parentElement.querySelector('.on');
        if (activeItem) activeItem.classList.remove('on');
        e.target.classList.add('on');
        // 검색 영역 초기화
        $searchInput.value = '';
        $cityList.value = '';

        // 모바일인 경우 모달 닫기
        if (isMobile) setTimeout(() => {
            e.target.closest('.modal') ? e.target.closest('.modal').style.display = 'none' : null;
        }, 300);

        const category = e.target.textContent.split('/')[0];
        changeCategory(category);
    });
});

/** 로고 카테고리 전체보기 - not use */
// $logo.addEventListener('click', () => {
//     if (!isMobile) {
//         document.getElementById('categoryModal').style.display = 'flex';
//     }
// });

/** 리스트 선택 */
$listCon.addEventListener('click', (e) => {
    if (e.target.closest('.list')) {

        // 모바일 체크
        if (isMobile) {
            document.getElementById('detailModal').style.display = 'flex';
        } else {
            // 클릭한 아이템 활성화
            const activeItem = $listCon.querySelector('.on');
            if (activeItem) activeItem.classList.remove('on');
            e.target.closest('.list').classList.add('on');
        }

        const targetItem = e.target.closest('.list').querySelector('.text-area');
        const url = targetItem.dataset.svcurl;
        const cont = targetItem.dataset.detailcont;
        const lat = targetItem.dataset.lat;
        const lng = targetItem.dataset.lng;

        detailService(url, cont);
        setLocationMap(lat, lng);
    }
});

/** 검색 */
$searchBtn.addEventListener('click', () => {
    // 아이템 초기화
    itemInit(true);

    const areaVal = document.getElementById('cityList').value;
    const srvVal = $searchInput.value;

    searchService(areaVal, srvVal);
});

/** 검색 - Enter */
$searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        $searchBtn.click();
    }
});

/** 리스트 페이지 이동 */
$pagination.addEventListener('click', (e) => {
    // 아이템 초기화
    itemInit(false);

    if (e.target.closest('span')) {
        const pageIndex = parseInt(e.target.textContent);
        moveListPage(pageIndex);
    }
    // 이전 버튼
    if (e.target.closest('.prev')) {
        if (pageGroup > 1) pageGroup--;
        const pageIndex = (pageGroup - 1) * 5 + 5;
        moveListPage(pageIndex);
    }
    // 다음 버튼
    if (e.target.closest('.next')) {
        pageGroup++;
        const pageIndex = (pageGroup - 1) * 5 + 1;
        moveListPage(pageIndex);
    }
});

/** 햄버거 버튼 */
$hamBtn.addEventListener('click', () => {
    document.getElementById('categoryModal').style.display = 'flex';
});

/** 모달 닫기 */
$closeBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
    });
});


init();