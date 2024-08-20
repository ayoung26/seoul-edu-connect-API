import { API_KEYS } from '../config/apiKey.js';
const kakaoMapApiKey = API_KEYS.KAKAO_MAP_KEY;

/** kakao map 설정 */
export const setLocationMap = (lat, lng) => {
    const script = document.createElement("script");
    script.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&autoload=false&libraries=clusterer,services&`;
    document.head.appendChild(script);
    script.onload = () => {
        kakao.maps.load(() => {
            // (default) 서울 위도경도
            const defLat = 37.566535;
            const defLng = 126.9779692;

            const setLat = lat ? lat : defLat;
            const setLng = lng ? lng : defLng;

            const isMobile = window.innerWidth <= 768;
            const container = isMobile ? document.getElementById('mapModal') : document.getElementById('map');
            let options = {
                center: new kakao.maps.LatLng(setLat, setLng),
                level: 4 // 확대
            };
            const map = new kakao.maps.Map(container, options);

            if (lat && lng) {
                // 마커 설정
                let imageSrc = './img/icon-map.png',
                    imageSize = new kakao.maps.Size(60, 60),
                    imageOption = {offset: new kakao.maps.Point(27, 69)};

                let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                    markerPosition = new kakao.maps.LatLng(setLat, setLng);

                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage
                });

                marker.setMap(map);
            }
        });
    };
}