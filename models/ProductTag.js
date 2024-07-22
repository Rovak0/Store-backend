const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    //just have 2 values, both reference keys
    id: { //everything feels like it should have a tag
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model: product,
        key: id
      },
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model: tag,
        key: id
      },
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
