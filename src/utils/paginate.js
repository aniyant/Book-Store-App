function paginate(totalItems, currentPage = 1, pageSize = 10) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return {
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        hasPrevPage,
        hasNextPage,
    };
}

module.exports = { paginate };
