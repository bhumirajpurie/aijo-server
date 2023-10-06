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
