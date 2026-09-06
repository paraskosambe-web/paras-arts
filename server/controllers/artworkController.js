const Artwork = require("../models/Artwork");
const cloudinary = require("../config/cloudinary");

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "paras-arts/artworks",
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
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      parseInt(req.query.limit) || 12,
      100
    );

    const search = (req.query.search || "").trim();
    const category = req.query.category;

    const filter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Artwork.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Artwork.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const art = await Artwork.findById(req.params.id);

    if (!art) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    res.json(art);
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

    if (!data.image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const art = await Artwork.create(data);

    res.status(201).json(art);
  } catch (err) {
    console.error("Artwork create error:", err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await Artwork.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    const data = { ...req.body };

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);

      data.image = uploaded.secure_url;
      data.imagePublicId = uploaded.public_id;

      /*
       * Delete the old Cloudinary image after
       * the new image has uploaded successfully.
       *
       * We intentionally do not touch old /uploads
       * images because those are legacy local files.
       */
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
            "Failed to delete old Cloudinary image:",
            deleteError
          );
        }
      }
    }

    const art = await Artwork.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(art);
  } catch (err) {
    console.error("Artwork update error:", err);
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const art = await Artwork.findByIdAndDelete(
      req.params.id
    );

    if (!art) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    /*
     * Delete Cloudinary image if this artwork
     * has a Cloudinary public ID.
     */
    if (art.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          art.imagePublicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );
      } catch (deleteError) {
        console.error(
          "Failed to delete Cloudinary image:",
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