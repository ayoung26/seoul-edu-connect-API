# < 서울시 교육 공공서비스 예약 정보 Site >

## 📢 소개 
서울시 교육 공공서비스 예약정보 API 를 연결한 반응형 웹사이트로, </br>
교육 프로그램과 위치 정보를 제공하고 예약페이지로 이동할 수 있습니다.

</br>

## 📍 와이어프레임 (web/mobile)
<img src="https://github.com/user-attachments/assets/601122f0-0af6-432c-8c10-955ebcf28d1e" width="900" height="690"/>

<img src="https://github.com/user-attachments/assets/8912530a-d667-47e0-90a6-6fb00234be77" width="300" height="650"/>
<img src="https://github.com/user-attachments/assets/5d4869d3-679d-4b03-80bc-f3145118cfd2" width="300" height="650"/>
</br>

## 📍 기능
- 서울시 교육 공공서비스의 상세정보를 제공합니다.
- 카테고리, 지역, 서비스명으로 원하는 서비스를 찾을 수 있습니다.
- 해당 서비스를 실행하는 실제 위치를 지도로 제공합니다.
- 예약링크를 통하여 예약페이지로 이동할 수 있습니다.
- 반응형으로 웹/모바일 동적 호환 가능합니다.
</br>

## 📍 API
- 서울 열린데이터광장 https://data.seoul.go.kr/dataList/OA-2268/S/1/datasetView.do
- 카카오맵 https://apis.map.kakao.com/
</br>

## 📍 실행 전, API KEY 발급
- 서울 열린데이터광장 API KEY
- 카카오맵 API KEY
</br>

## 📍 프로젝트 실행
1. repository clone
   ```
   git clone https://github.com/ayoung26/seoul-edu-connect-API.git
   ```

2. 루트에서 config 폴더와 아래 apiKey.js 파일 생성
   ```
   config/apiKey.js
   ```
   파일 안의 코드는 아래를 복사하여 사용합니다.
   ```
   export const API_KEYS = {
    SEOUL_EDU_KEY: '서울 열린데이터광장 발급받은 키',
    KAKAO_MAP_KEY: '카카오맵 발급받은 키'
   };
   ```

3. 프로젝트 실행
</br>

## 📍 Skill
`HTML`, `CSS`, `JAVASCRIPT`, `swiper.js`
