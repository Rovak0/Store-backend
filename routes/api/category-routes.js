const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    //find the categories
    const categoryData = await Category.findAll();
    const returnData = [];
    //go through each category and add the data
    for (categoryBulk of categoryData){
      //so I don't need to repeat category.dataValues
      const category = categoryBulk.dataValues;
      //find all atatched products
      const productData = await Product.findAll({where: {category_id: category.id}});
      const returnProducts = [];
      for (productBulk of productData){
        //add the product names to the things being returned
        const product = productBulk.dataValues;
        returnProducts.push(product.product_name);
      };
      returnData.push({...category, "products" : returnProducts});
    }
    res.status(200).json(returnData);
  }
  catch (err){
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const categoryData = await Category.findByPk(req.params.id);
    const returnData = [];
    for (categoryBulk of [categoryData]){ //for is an array function, make the single item an array
      //this is lazy coding, but I want to reuse what I have written
      const category = categoryBulk.dataValues;
      const productData = await Product.findAll({where: {category_id: category.id}});
      const returnProducts = [];
      for (productBulk of productData){
        const product = productBulk.dataValues;
        returnProducts.push(product.product_name);
      };
      returnData.push({...category, "products" : returnProducts});
    }
    res.status(200).json(returnData);
  }
  catch (err){
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    const category = await Category.create(req.body);
    res.status(200).json(category);
  }
  catch(err){
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const category = await Category.update(
      {
        category_name: req.body.category_name
      }, 
      {where: {id: req.params.id}}
    );
    if(!category){
      res.status(404).json({message: "Category not found"});
    }
    res.status(200).json(category);
  }
  catch(err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const categoryData = await Category.destroy({
      where: {id: req.params.id}
    });
    if(!categoryData){
      res.status(404).json({message: "No category found with that id"});
    };
    res.status(200).json(categoryData);
  }
  catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
