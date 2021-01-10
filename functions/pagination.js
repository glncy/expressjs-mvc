const getPagination = (page, size = 10) => {
    const limit = size;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (result, page, limit) => {
    const { count: totalItems, rows: data } = result;
    const currentPage = page+1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, data, totalPages, currentPage };
};

module.exports = {
    getPagination,
    getPagingData
};
