import Feature from "../../models/Feature.js";

export const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(422).json({
        success: false,
        message: "Please upload a image first!",
      });
    }

    const featureImage = new Feature({
      image,
    });

    await featureImage.save();

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: featureImage,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeatureImages = async (req, res) => {
  try {
    const featureImages = await Feature.find({});

    res.json({
      success: true,
      data: featureImages,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
