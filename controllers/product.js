import catchAsync from "../utils/catchAsync.js";
import Product from "../models/Product.js";
import createError from "../utils/createError.js";
import clearImage from "../utils/clearImage.js";

export const createProduct = catchAsync(async (req, res) => {
  // const colors = JSON.parse(req.body.colors);
  // const sizes = JSON.parse(req.body.sizes);
  //  req.files.map((file) => file.path);
  const productImage = req.files?.map((file) => `${file.path}`);

  const product = await Product.create({
    ...req.body,
    images: productImage,
  });
  if (!product) throw createError(500, "Product cannot be created");
  res
    .status(201)
    .send({ status: "success", message: "product added successfully" });
});

export const getProducts = catchAsync(async (req, res) => {
  const {
    keyWord,
    minPrice,
    maxPrice,
    page,
    sort,
    perPage,
    brands,
    categories,
  } = req.query;
  const currentPage = Number(page || 1);
  const productsPerPage = Number(perPage || 12);

  const priceFilter = {
    price: {
      $gte: minPrice || 0,
      $lte: maxPrice || Infinity,
    },
  };

  const searchFilter = keyWord
    ? {
        $or: [
          { name: { $regex: keyWord, $options: "i" } },
          { description: { $regex: keyWord, $options: "i" } },
        ],
      }
    : {};

  const brandFilter = brands > 0 ? { brand: { $in: brands?.split(",") } } : {};

  const categoryFilter = categories
    ? { category: { $in: categories?.split(",") } }
    : {};
  const sortingCriteria = sort || "_id";
  const totalProducts = await Product.countDocuments({
    $and: [priceFilter, searchFilter, brandFilter, categoryFilter],
  });

  const products = await Product.find({
    $and: [priceFilter, searchFilter, brandFilter, categoryFilter],
  })
    .sort(sortingCriteria)
    .select("_id name brand category price images discount")
    .skip((currentPage - 1) * productsPerPage)
    .limit(productsPerPage);

  const productsWithFirstImage = products.map((product) => {
    const image = product.images.length > 0 ? product.images[0] : null;
    return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discount: product.discount,
      image: image,
    };
  });

  res.status(200).send({
    status: "success",
    products: productsWithFirstImage,
    currentPage: currentPage,
    totalProducts: totalProducts,
    productsPerPage: productsPerPage,
  });
});

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find().select("-__v -createdAt -updatedAt ");
  if (!products) return createError("No products found.", 404);
  const productsWithFirstImage = products.map((product) => {
    const image = product.images.length > 0 ? product.images[0] : null;
    return {
      ...product._doc,
      image: image,
    };
  });
  res.status(200).send({ status: "success", products: productsWithFirstImage });
});

export const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).select(
    "-__v -createdAt -updatedAt "
  );

  if (!product) {
    return createError("Product not found.", 404);
  }

  res.status(200).send({ status: "success", product });
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return createError("Product not found.", 404);
  if (req.files) req.body.images = req.files?.map((file) => file.path);

  product.images.map((image) => {
    if (!req.body.images.includes(image)) {
      clearImage(image);
    }
  });
  await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send({
    status: "success",
    message: "product updated successfully",
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    throw createError(`Product is not found with id of ${req.params.id}`, 404);

  product.images.map((image) => {
    clearImage(image);
  });

  await Product.findByIdAndRemove(req.params.id);

  res
    .status(200)
    .send({ status: "success", message: "Product Deleted Successfully" });
});

export const getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await Product.find().sort({ discount: -1 }).limit(6);

  // Extract the first image URL from each product's images array
  const productsWithFirstImage = products.map((product) => {
    const image = product.images.length > 0 ? product.images[0] : null;
    return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discount: product.discount,
      image: image,
      quantity: product.quantity,
      // Include the first image URL
    };
  });

  res.status(200).send({ status: "success", products: productsWithFirstImage });
});

// new arrival
export const getNewArrivalProducts = catchAsync(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(6);

  // Extract the first image URL from each product's images array
  const productsWithFirstImage = products.map((product) => {
    const image = product.images.length > 0 ? product.images[0] : null;
    return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discount: product.discount,
      image: image,
      quantity: product.quantity,
      // Include the first image URL
    };
  });

  res.status(200).send({ status: "success", products: productsWithFirstImage });
});

export const getProductByPriceRange = catchAsync(async (req, res) => {
  const products = await Product.find({
    price: { $gte: req.params.minPrice, $lte: req.params.maxPrice },
  });

  // Extract the first image URL from each product's images array
  const productsWithFirstImage = products.map((product) => {
    const image = product.images.length > 0 ? product.images[0] : null;
    return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discount: product.discount,
      image: image, // Include the first image URL
    };
  });

  res.status(200).send({ status: "success", products: productsWithFirstImage });
});
