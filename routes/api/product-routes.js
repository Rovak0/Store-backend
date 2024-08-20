const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try{
    const productData = await Product.findAll();
    const returnData = []
    for (productBulk of productData){
      const product = productBulk.dataValues
      const catData = await Category.findByPk(product.category_id);
      //find all the tags
      const productTagData = await ProductTag.findAll({where: {product_id: product.id}});
      const tags = [];
      for (thing of productTagData){
        const tag = await Tag.findAll({where: {id: thing.dataValues.tag_id}});
        tags.push(tag[0].dataValues.tag_name);
      }

      //should be able to run the spread operator and make a json object to send back
      const subReturn = {...(product), 
        "categoryName": catData.category_name,
        "tags": tags
      };
      returnData.push(subReturn);
    }
    //check to see what exactly is returned
    res.status(200).json(returnData);
  }
  catch(err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{
    const productData = await Product.findByPk(req.params.id, 
      // {
      // include: [{model: Tag, as: "product_tags", where: {id: Product.product_id}}]
      // include: [{ model: Tag, through: ProductTag, as: 'product_tags' }]
      // }
    );
    //couldn't make it work with a through table on its own, so I made it work manually
    //there isn't a tag attached directly to product
    //find the catagoy and the tag based off of id's given (either the product's or the cat's)
    const catData = await Category.findByPk(productData.category_id);
    //find all the tags
    const productTagData = await ProductTag.findAll({where: {product_id: req.params.id}});
    const tags = [];
    for (thing of productTagData){
      const tag = await Tag.findAll({where: {id: thing.dataValues.tag_id}});
      tags.push(tag[0].dataValues.tag_name);
    }

    //should be able to run the spread operator and make a json object to send back
    const returnObject = {...(productData.dataValues), 
      "categoryName": catData.category_name,
      "tags": tags
    };
    console.log(returnObject);
    //check to see what exactly is returned
    res.status(200).json(returnObject);
  }
  catch(err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        console.log(typeof(req.body.tagIds));
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try{
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData){ //the search missed
      res.status(404).json({message: "No product found with that id"});
    }
    res.status(200).json(productData);
  }
  catch(err){
    res.status(500).json(err); //the search failed
  }
});

module.exports = router;
