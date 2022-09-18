
const PaginationService = {

  validatePageNo: req => {
    if (typeof req.query.pageNo === "undefined" || typeof req.query.pageSize === "undefined") {
      return {query: {}, pageNo: 1, pageSize: null};
    } else {
      const pageNo = parseInt(req.query.pageNo);
      const pageSize = parseInt(req.query.pageSize);
      if (pageNo < 0 || pageNo === 0 || pageSize < 0 || pageSize === 0) {
        return {query: {}, pageNo: 1, pageSize: null};
      } else {
        const query = {skip: pageSize * (pageNo - 1), limit: pageSize};
        return {query: query, pageNo: pageNo, pageSize: pageSize}
      }
    }
  },

  filterPaginateQuery: req => {
    delete req.query['pageNo'];
    delete req.query['pageSize'];
    return req.query;
  }

};

module.exports = PaginationService;
