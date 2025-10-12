// controllers/user/alumni-news-controller.js
const News = require("../../models/News");
const mongoose = require("mongoose");

// Get all published news (public/alumni view)
const getAllPublishedNews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      tag,
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = req.query;

    // Only show published and active news
    const filter = {
      status: "published",
      isActive: true,
    };

    if (category) filter.category = category;

    if (tag) filter.tags = { $in: [tag] };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = {};
    // Pinned news always come first
    if (sortBy === "publishedAt") {
      sortOptions.isPinned = -1;
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const news = await News.find(filter)
      .select("-__v")
      .populate("author", "firstName lastName profilePicture")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add category info and reading time to each news item
    const newsWithInfo = news.map((item) => {


      return {
        ...item,
        categoryInfo: News.getCategoryInfo(item.category),

      };
    });

    const totalNews = await News.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: newsWithInfo,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNews / limit),
        totalNews,
        hasNextPage: page < Math.ceil(totalNews / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.error("Error in getAllPublishedNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// Get pinned news
const getPinnedNews = async (req, res) => {
  try {
    const news = await News.find({
      status: "published",
      isActive: true,
      isPinned: true,
    })
      .select("-__v")
      .populate("author", "firstName lastName profilePicture")
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();

    const newsWithInfo = news.map((item) => {


      return {
        ...item,
        categoryInfo: News.getCategoryInfo(item.category),
 
      };
    });

    res.status(200).json({
      success: true,
      data: newsWithInfo,
    });
  } catch (e) {
    console.error("Error in getPinnedNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pinned news",
    });
  }
};

// Get recent news (last 10)
const getRecentNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const news = await News.find({
      status: "published",
      isActive: true,
    })
      .select("title excerpt coverImage publishedAt category slug")
      .populate("author", "firstName lastName")
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const newsWithInfo = news.map((item) => ({
      ...item,
      categoryInfo: News.getCategoryInfo(item.category),
    }));

    res.status(200).json({
      success: true,
      data: newsWithInfo,
    });
  } catch (e) {
    console.error("Error in getRecentNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent news",
    });
  }
};

// Get news by slug
const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const news = await News.findOne({
      slug,
      status: "published",
      isActive: true,
    })
      .select("-__v")
      .populate("author", "firstName lastName profilePicture email")
      .lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    // Increment view count asynchronously (don't wait for it)
    News.findByIdAndUpdate(news._id, { $inc: { viewCount: 1 } }).exec();



    // Add category info
    const newsWithInfo = {
      ...news,
      categoryInfo: News.getCategoryInfo(news.category),

    };

    res.status(200).json({
      success: true,
      data: newsWithInfo,
    });
  } catch (e) {
    console.error("Error in getNewsBySlug:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// Get news by ID
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID!",
      });
    }

    const news = await News.findOne({
      _id: id,
      status: "published",
      isActive: true,
    })
      .select("-__v")
      .populate("author", "firstName lastName profilePicture email")
      .lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    // Increment view count asynchronously
    News.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();


    // Add category info
    const newsWithInfo = {
      ...news,
      categoryInfo: News.getCategoryInfo(news.category),

    };

    res.status(200).json({
      success: true,
      data: newsWithInfo,
    });
  } catch (e) {
    console.error("Error in getNewsById:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// Get news by category
const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const news = await News.find({
      category,
      status: "published",
      isActive: true,
    })
      .select("-__v")
      .populate("author", "firstName lastName profilePicture")
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const newsWithInfo = news.map((item) => {
   

      return {
        ...item,
        categoryInfo: News.getCategoryInfo(item.category),

      };
    });

    const totalNews = await News.countDocuments({
      category,
      status: "published",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: newsWithInfo,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNews / limit),
        totalNews,
        hasNextPage: page < Math.ceil(totalNews / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    console.error("Error in getNewsByCategory:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news by category",
    });
  }
};

// Get related news (same category, exclude current)
const getRelatedNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID!",
      });
    }

    // First get the current news to know its category
    const currentNews = await News.findById(id).select("category");

    if (!currentNews) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    // Find related news with same category
    const relatedNews = await News.find({
      _id: { $ne: id },
      category: currentNews.category,
      status: "published",
      isActive: true,
    })
      .select("title excerpt coverImage publishedAt category slug")
      .populate("author", "firstName lastName")
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const newsWithInfo = relatedNews.map((item) => ({
      ...item,
      categoryInfo: News.getCategoryInfo(item.category),
    }));

    res.status(200).json({
      success: true,
      data: newsWithInfo,
    });
  } catch (e) {
    console.error("Error in getRelatedNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related news",
    });
  }
};

// Get all available categories with counts
const getCategories = async (req, res) => {
  try {
    const categories = await News.aggregate([
      {
        $match: {
          status: "published",
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const categoriesWithInfo = categories.map((item) => ({
      category: item._id,
      categoryInfo: News.getCategoryInfo(item._id),
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      data: categoriesWithInfo,
    });
  } catch (e) {
    console.error("Error in getCategories:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Get all tags with counts
const getTags = async (req, res) => {
  try {
    const tags = await News.aggregate([
      {
        $match: {
          status: "published",
          isActive: true,
        },
      },
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 50,
      },
    ]);

    const formattedTags = tags.map((item) => ({
      tag: item._id,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      data: formattedTags,
    });
  } catch (e) {
    console.error("Error in getTags:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
    });
  }
};

module.exports = {
  getAllPublishedNews,
  getPinnedNews,
  getRecentNews,
  getNewsBySlug,
  getNewsById,
  getNewsByCategory,
  getRelatedNews,
  getCategories,
  getTags,
};