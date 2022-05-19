const { Sequelize, DataTypes, Op } = require("sequelize");
const Pool = require("pg");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const cookieSessionValidity = 1000 * 60 * 60 * 24 * 30; // 30 days
const moment = require("moment-timezone");

const sequelize = new Sequelize(process.env.CONNECTIONSTRING, {
  dialect: "postgres",
  pool: {
    max: 20,
    idle: 30000,
    acquire: 60000,
  },
  timezone: "utc",
  logging: false,
});

const Users = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
    },
    class_number: { type: DataTypes.TINYINT, allowNull: false },
    section: { type: DataTypes.CHAR, allowNull: false },
    submitted_at: { type: DataTypes.DATEONLY, allowNull: true },
    admin: { type: DataTypes.BOOLEAN, allowNull: true },
    email: { type: DataTypes.TEXT, allowNull: false },
    password_digest: { type: DataTypes.BLOB, allowNull: false },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    paranoid: true,
  }
);

const Products = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
    },
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(2, 4),
    deleted_at: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { sequelize, timestamps: false, underscored: true }
);

const UsersProducts = sequelize.define(
  "users_products",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    product_id: {
      type: DataTypes.UUID,
      references: {
        model: Products,
        key: "id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    add_at: { type: DataTypes.DATEONLY, allowNull: true },
    quantity: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  {
    sequelize,
    timestamps: false,
    onDelete: "CASCADE",
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "product_id"],
      },
    ],
  }
);

const Sessions = sequelize.define(
  "session",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    created_at: { type: DataTypes.DATEONLY, allowNull: true },
    expires_at: { type: DataTypes.DATEONLY, allowNull: true },
  },
  {
    sequelize,
    timestamps: false,
    onDelete: "CASCADE",
    underscored: true,
  }
);

Users.belongsToMany(Products, { through: UsersProducts });
Products.belongsToMany(Users, { through: UsersProducts });

Users.hasMany(UsersProducts);
UsersProducts.belongsTo(Users);

Products.hasMany(UsersProducts);
UsersProducts.belongsTo(Products);

Users.hasMany(Sessions);
Sessions.belongsTo(Users);

async function userFromToken(token) {
  const user = await Sessions.findOne({
    include: [{ model: Users, attributes: [] }],
    where: {
      id: token,
      expires_at: { [Op.gte]: moment().utc(new Date()) },
    },
    raw: true,
    attributes: [
      [sequelize.literal('"user"."id"'), "user_id"],
      [sequelize.literal('"user"."class_number" || "user"."section"'), "class"],
      [sequelize.literal('"user"."submitted_at"'), "submitted_at"],
      [sequelize.literal('"user"."email"'), "email"],
      [sequelize.literal('"user"."admin"'), "admin"],
      [sequelize.literal('"user"."password_digest"'), "password_digest"],
    ],
  });
  return user;
}

async function userFromRequest(req) {
  const { session } = req.cookies;
  if (!session) return null;

  return userFromToken(session);
}

async function validateCredentialsAndLogin(req, res) {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: { email },
  });
  const { id: user_id, password_digest } = user;

  let from_bin_string_digest = "";
  for (var i = 0; i < password_digest.length; ++i) {
    from_bin_string_digest += String.fromCharCode(password_digest[i]);
  }

  const match = await bcrypt.compare(password, from_bin_string_digest);
  if (match) {
    await Sessions.create({
      user_id,
    });
    const result = await Sessions.findOne({
      where: { user_id },
    });
    const parsed_result = result.toJSON();
    const token = parsed_result.id;

    /* await createQuery()
      .input("id", sql.VarChar, token)
      .input("user_id", sql.Int, user_id)
      .query("INSERT INTO sessions(id, user_id) VALUES(@id, @user_id)");
*/
    res.cookie("session", token, {
      maxAge: cookieSessionValidity,
      httpOnly: true,
    });
    return res.send("");
  } else {
    return res.json({
      message: "Devi registrarti prima di fare il login",
    });
  }
}

async function checkUserLogin(req, res) {
  const user = await userFromRequest(req);
  if (!user) {
    res.status(401).json({ redirect: true });
    return;
  }

  return user;
}

module.exports = {
  Users,
  Products,
  UsersProducts,
  Sessions,
  DataTypes,
  Op,
  sequelize,
  userFromToken,
  validateCredentialsAndLogin,
  userFromRequest,
  checkUserLogin,
};
