"use strict";
/* ====================================================== */
/*                     BLOG API CONTROLLERS               */
/* ====================================================== */

module.exports = (req, res, next) => {
    // ? Queries from URL 
  const filter = req.query?.filter || {};

  // ? Get search parametres and convert to mongo searching syntax
  const search = req.query?.search || {};
  for (let key in search) search[key] = { $regex: search[key], $options: "i" };

  // ? asc or desc for sort
  const sort = req.query?.sort || {};

  //   ? limit count per a page
  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 20);

  //   ? which page want to see , page is number to skip
  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0;

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;


// ? Its a function get a model and do some process to filtering
  res.getModelList = async function (Model,customFilter={},populate=null) {
    const filtersAndSearch = { ...filter, ...search, ...customFilter  }

    return await Model.find(filtersAndSearch).populate(populate)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  };

//   ? Its shows us detail of data 
  res.getModelListDetails = async function (Model, customFilter = {}) {

    const filtersAndSearch = { ...filter, ...search, ...customFilter  }

    const data = await Model.find(filtersAndSearch);

    let details = {
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2,
        total: Math.ceil(data.length / limit),
      },
      totalRecords: data.length,
    };
    details.pages.next =
      details.pages.next > details.pages.total ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };
  next();
};
