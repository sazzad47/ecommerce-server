const getOneProduct = (id) => {
  return `
  select ecommerce.product.* , ecommerce.category.title as category_title
from ecommerce.product INNER JOIN ecommerce.category ON ecommerce.product.category_id = ecommerce.category.id
where ecommerce.product.id = ${id}
;
  `;
};

const getOneProductByName = (name) => {
  return `
  select ecommerce.product.id, ecommerce.product.name
  from ecommerce.product 
  where ecommerce.product.name ILIKE '%${name}%';
  `;
};

const getOneProductByNameV2 = (name) => {
  return `
  select DISTINCT pd.id, pd.name , pd.price , pd.discount ,   (
    SELECT image_url
    FROM ecommerce.product_images pi
    WHERE pi.product_id = pd.id
    ORDER BY pi.id ASC
    LIMIT 1
  ) AS first_image
  from ecommerce.product pd
  where pd.name ILIKE '%${name}%'
  ;
  `;
};

const getCategoryProps = (id) => {
  return `
  SELECT DISTINCT ecommerce.property.*, 'property' AS table_name 
  FROM ecommerce.property 
  INNER JOIN ecommerce.categories_properties 
  ON ecommerce.property.id = ecommerce.categories_properties.property_id
  WHERE ecommerce.categories_properties.category_id=${id};
  `;
};

const getProductPropsValues = (id) => {
  return `SELECT ecommerce.property.id, ecommerce.property.name, ecommerce.property_values.value from ecommerce.product_properties
  INNER JOIN ecommerce.property ON ecommerce.product_properties.property_id = ecommerce.property.id
  INNER JOIN ecommerce.property_values ON ecommerce.product_properties.property_value_id = ecommerce.property_values.id
  WHERE ecommerce.product_properties.product_id = ${id}
  ;`;
};

const getCartQuantity = (cart_id) => {
  return `
  SELECT SUM(quantity) AS total_items
FROM ecommerce.cart_items
WHERE cart_id = ${cart_id};

  `;
};

const getProducts = (category_id, limit, page, filters) => {
  const validateFiltring = Object.keys(filters).length;
  let query = `
    SELECT DISTINCT p.*, pi.image_url AS first_image
    FROM ecommerce.product p
    LEFT JOIN ecommerce.product_images pi ON p.id = pi.product_id AND pi.id = (
      SELECT MIN(id)
      FROM ecommerce.product_images
      WHERE product_id = p.id
    )
    WHERE p.category_id = ${category_id}
      ${validateFiltring ? "AND (" : ""}
  `;

  const filterClauses = Object.entries(filters).map(
    ([propertyName, propertyValues]) => {
      const valuesString = propertyValues
        .map((value) => `'${value}'`)
        .join(", ");
      return `EXISTS (
        SELECT 1
        FROM ecommerce.product_properties pp
        INNER JOIN ecommerce.property prop ON prop.id = pp.property_id
        INNER JOIN ecommerce.property_values pv ON pv.id = pp.property_value_id
        WHERE pp.product_id = p.id
          AND prop.name = '${propertyName}'
          AND pv.value IN (${valuesString})
      )`;
    }
  );

  query += filterClauses.join(" AND ");
  query += `
    ${validateFiltring ? ")" : ""}
    ORDER BY p.id
    LIMIT ${limit} OFFSET ${page == 1 ? 0 : (page - 1) * limit};
  `;

  return query;
};

const getCarItems = (cart_id) => {
  return `
        SELECT pd.id, pd.name, cat.title, pd.price , pd.discount , ct.quantity ,MIN(pi.image_url) AS image_url,
        (pd.price * ct.quantity) as total
        FROM ecommerce.product pd
        INNER JOIN ecommerce.cart_items ct ON pd.id = ct.product_id
        INNER JOIN ecommerce.product_images pi ON pi.product_id = pd.id
        INNER JOIN ecommerce.category cat ON pd.category_id = cat.id
        WHERE ct.cart_id = ${cart_id}
        GROUP BY pd.name, pd.price ,cat.title , pd.discount , ct.quantity , pd.id , ct.created_at
        ORDER BY ct.created_at;
  `;
};

const getUserRecentOrders = (user_id) => {
  return `SELECT ord.id, ord.total, ord.created_at,
          STRING_AGG(pd.name, ', ') AS product_names
          FROM ecommerce.order ord
          INNER JOIN ecommerce.order_items ot ON ord.id = ot.order_id
          INNER JOIN ecommerce.product pd ON ot.product_id = pd.id
          WHERE ord.user_id = ${user_id}
          GROUP BY ord.id, ord.total, ord.created_at
          ORDER BY ord.created_at DESC
          LIMIT 5
          ;`;
};

const getAllCategoriesData = () => {
  return `
      SELECT
      c.id, c.title, c.image_url,
      COUNT(p.id) AS number_of_products
      FROM
      ecommerce.category c
      LEFT JOIN
      ecommerce.product p ON c.id = p.category_id
      GROUP BY
      c.id;

  `;
};

const getDashboardCustomers = () => {
  return `
        SELECT 
        u.first_name || ' ' || u.last_name AS name, 
        u.email,
        u.id,
        DATE(u.created_at) AS joined_time, 
        COALESCE(COUNT(o.user_id), 0) AS number_of_orders
        FROM ecommerce.user u 
        LEFT JOIN ecommerce.order o ON o.user_id = u.id
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.created_at;

  `;
};

const getDashboardCustomersId = (condition) => {
  return `
  SELECT 
  u.first_name || ' ' || u.last_name AS name, 
  u.email,
  u.id,
  DATE(u.created_at) AS joined_time, 
  COALESCE(COUNT(o.user_id), 0) AS number_of_orders
  FROM ecommerce.user u 
  LEFT JOIN ecommerce.order o ON o.user_id = u.id
  WHERE ${condition}
  GROUP BY u.id, u.first_name, u.last_name, u.email, u.created_at;

`;
};

const getDashboardOrders = () => {
  return `
  SELECT o.total , o.id , o.status , DATE(o.created_at) AS order_date , ad.city , ad.address , ad.postal_code , 
  u.first_name || ' ' || u.last_name as customer_name FROM ecommerce.order o inner join 
  ecommerce.user u on o.user_id = u.id 
  inner join ecommerce.address ad on ad.id = o.address_id ORDER BY o.created_at;
  `;
};

const getDashboardOrdersId = (id) => {
  return `
    SELECT o.total , o.id , o.status , DATE(o.created_at) AS order_date , ad.* ,
    u.first_name || ' ' || u.last_name as customer_name FROM ecommerce.order o inner join 
    ecommerce.user u on o.user_id = u.id inner join 
    ecommerce.address ad on ad.id = o.address_id WHERE o.id = ${id} ORDER BY o.created_at;
  `;
};

const getCardsData = (query) => {
  const queries = {
    totalUsers: `Select COUNT(u.id) as users_this_month from ecommerce.user u 
    where EXTRACT(MONTH FROM u.created_at) = EXTRACT(MONTH FROM CURRENT_DATE);`,
    totalOrders: `Select COUNT(o.id) as orders_this_month from ecommerce.order o
    where EXTRACT(MONTH FROM o.created_at) = EXTRACT(MONTH FROM CURRENT_DATE);`,
    totalAmount: `Select COALESCE(SUM(o.total) , 0) as total_this_month from ecommerce.order o
    where EXTRACT(MONTH FROM o.created_at) = EXTRACT(MONTH FROM CURRENT_DATE) and o.status = 'DELIVERED';`,
    PendingAmount: `Select COALESCE(SUM(o.total) , 0) as pending_this_month from ecommerce.order o
    where EXTRACT(MONTH FROM o.created_at) = EXTRACT(MONTH FROM CURRENT_DATE) and o.status = 'PENDING';`,
  };

  return queries[query];
};

const getOrdersPerDay = () => {
  return `
  SELECT TO_CHAR(DATE_TRUNC('day', ecommerce.order.created_at), 'YYYY-MM-DD') AS date, COUNT(*) AS orders
      FROM ecommerce.order
      where EXTRACT(MONTH FROM ecommerce.order.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      GROUP BY date;
  `;
};

const getProductViews = () => {
  return `Select pd.name , pd.views from ecommerce.product pd ORDER BY pd.views DESC LIMIT 5`;
};

const getClinetPurchaseHistory = (id) => {
  return `
  select pd.id , pd.name , pd.price , ct.title from ecommerce.order o 
  inner join ecommerce.order_items ot on o.id = ot.order_id 
  inner join ecommerce.product pd on pd.id = ot.product_id
  inner join ecommerce.category ct on ct.id = pd.category_id
  where o.user_id = ${id}
  order by o.created_at desc
  limit 5;
  `;
};

const getProductsForRecommendationSystem = () => {
  return `
  select pd.id , pd.name , pd.price , ct.title from ecommerce.product pd 
  inner join ecommerce.category ct on ct.id = pd.category_id
  order by pd.created_at desc; 
  `;
};

module.exports = {
  getProducts,
  getOneProduct,
  getCategoryProps,
  getProductPropsValues,
  getCartQuantity,
  getCarItems,
  getUserRecentOrders,
  getAllCategoriesData,
  getDashboardCustomers,
  getDashboardOrders,
  getCardsData,
  getOrdersPerDay,
  getProductViews,
  getDashboardOrdersId,
  getDashboardCustomersId,
  getClinetPurchaseHistory,
  getProductsForRecommendationSystem,
  getOneProductByName,
  getOneProductByNameV2,
};
