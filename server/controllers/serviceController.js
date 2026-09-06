const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary");

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "paras-arts/services",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
}

exports.list = async (req, res, next) => {
  try {
    const items = await Service.find().sort({ createdAt: 1 });

    res.json({ items });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json(service);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);

      data.image = uploaded.secure_url;
      data.imagePublicId = uploaded.public_id;
    }

    if (!data.title || !data.description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const service = await Service.create(data);

    res.status(201).json(service);
  } catch (err) {
    console.error("Service create error:", err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await Service.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const data = { ...req.body };

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);

      data.image = uploaded.secure_url;
      data.imagePublicId = uploaded.public_id;

      // Delete old Cloudinary image only after
      // the new image has uploaded successfully.
      if (
        existing.imagePublicId &&
        !existing.imagePublicId.startsWith("/uploads/")
      ) {
        try {
          await cloudinary.uploader.destroy(
            existing.imagePublicId,
            {
              resource_type: "image",
              invalidate: true,
            }
          );
        } catch (deleteError) {
          console.error(
            "Failed to delete old Cloudinary service image:",
            deleteError
          );
        }
      }
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(service);
  } catch (err) {
    console.error("Service update error:", err);
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Delete Cloudinary image when service is deleted.
    if (
      service.imagePublicId &&
      !service.imagePublicId.startsWith("/uploads/")
    ) {
      try {
        await cloudinary.uploader.destroy(
          service.imagePublicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );
      } catch (deleteError) {
        console.error(
          "Failed to delete Cloudinary service image:",
          deleteError
        );
      }
    }

    res.json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
};