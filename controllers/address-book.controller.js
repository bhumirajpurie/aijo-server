import AddressBook from "../models/address-book.modal.js";
import createError from "../utils/createError.js";
import User from "../models/User.js";

export const createAddressBook = async (req, res) => {
  const { province_id, province, city, area, fullAddress } = req.body;
  const user = req.user;

  try {
    const userProjection = "firstName lastName phoneNumber";

    const populatedUser = await User.findById(user._id).select(userProjection);

    if (!populatedUser) return createError(400, "User not found");

    const addressBook = await AddressBook.create({
      province_id,
      province,
      city,
      area,
      user: populatedUser,
      fullAddress,
    });

    if (!addressBook) return createError(400, "Failed to create address book");

    return res.status(200).json({
      status: "success",
      message: addressBook,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getAddressBook = async (req, res) => {
  try {
    const addressBook = await AddressBook.find({
      user: req.user._id,
    });
    if (!addressBook) return createError(404, "Address book not found");
    res.status(200).json({
      status: "success",
      address: addressBook,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getSingleAddressBook = async (req, res) => {
  try {
    const addressBook = await AddressBook.findById(req.params.id);
    if (!addressBook) return createError(404, "Address book not found");
    res.status(200).json({
      status: "success",
      address: addressBook,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// delete
export const deleteAddressBook = async (req, res) => {
  try {
    const addressBook = await AddressBook.findByIdAndDelete(req.params.id);
    if (!addressBook) return createError(404, "Address book not found");
    res.status(200).json({
      status: "success",
      message: "Address book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// update
export const updateAddressBook = async (req, res) => {
  const {province_id, city, province, area, fullAddress } = req.body;
  try {
    const addressBook = await AddressBook.findByIdAndUpdate(
      req.params.id,
      {
        province_id,
        city,
        province,
        area,
        fullAddress,
      },
      { new: true }
    );
    if (!addressBook) return createError(404, "Address book not found");
    res.status(200).json({
      status: "success",
      message: "Address book updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
