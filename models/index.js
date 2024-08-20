// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
// Product.hasOne(Category, {
//   foreignKey: 'catId',
//   onDelete: "cascade"
// })
// // Categories have many Products
// Category.hasMany(Product, {
//   foreignKey: 'catId', 
//   onDelete: "cascade"
// })

// Products belongToMany Tags (through ProductTag)
// Product.belongsToMany(Tag, {
//   through: ProductTag,
//   foreignKey: ''
// })
// Tags belongToMany Products (through ProductTag)

//product tags reference product ids and tag ids

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
