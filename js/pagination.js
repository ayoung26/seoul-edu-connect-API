/** 페이지네이션 */
export const createPagination = (totalCnt, currentPage) => {
    // 총 페이지 수
    const totalPages = Math.ceil(totalCnt / 15);
    // 페이지 그룹
    const pageGroup = Math.ceil(currentPage / 5);
    // 첫번째 페이지 번호
    let firstPage = ((pageGroup - 1) * 5) + 1;
    // 마지막 페이지 번호
    let lastPage = pageGroup * 5;

    if (lastPage > totalPages) lastPage = totalPages;

    let htmlStr = '';
    if (firstPage > 1) {
        htmlStr += '<button class="prev"></button>';
    }
    // 페이지 번호 생성
    for (let i = firstPage; i <= lastPage; i++) {
        if (i === currentPage) {
            htmlStr += `<span class="current">${i}</span>`
        } else {
            htmlStr += `<span>${i}</span>`
        }
    }
    if (lastPage < totalPages) {
        htmlStr += '<button class="next"></button>';
    }

    return htmlStr;
};
