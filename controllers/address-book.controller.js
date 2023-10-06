import AddressBook from "../models/address-book.modal.js";
import createError from "../utils/createError.js";

export const createAddressBook = async (req, res) => {
  const { province, city, area } = req.body;
  const user = req.user;
  try {
    const addressBook = await AddressBook.create({
      province,
      city,
      area,
      user,
    });
    if (!addressBook) return createError(400, "Failed to create address book");
    return res.status(200).json({
      status: "success",
      message: "Address book created successfully",
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
  const { city, province, area } = req.body;
  try {
    const addressBook = await AddressBook.findByIdAndUpdate(
      req.params.id,
      {
        city,
        province,
        area,
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
