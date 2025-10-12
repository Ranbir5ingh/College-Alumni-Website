// controllers/admin/admin-news-controller.js
const News = require("../../models/News");
const mongoose = require("mongoose");

// Create news
const createNews = async (req, res) => {
  try {
    const { id } = req.user; // Admin ID from auth middleware
    const {
      title,
      description,
      excerpt,
      coverImage,
      attachments,
      category,
      tags,
      status,
      isPinned,
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required!",
      });
    }

    const news = await News.create({
      title,
      description,
      excerpt,
      coverImage,
      attachments,
      category,
      tags: tags || [],
      status: status || "draft",
      isPinned: isPinned || false,
      author: id,
    });

    const populatedNews = await News.findById(news._id)
      .populate("author", "firstName lastName email")
      .lean();

    res.status(201).json({
      success: true,
      message: "News created successfully!",
      data: populatedNews,
    });
  } catch (e) {
    console.error("Error in createNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to create news",
    });
  }
};

// Get all news (admin view - includes drafts)
const getAllNews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      isPinned,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = { isActive: true };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const news = await News.find(filter)
      .populate("author", "firstName lastName email")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add category info to each news item
    const newsWithInfo = news.map((item) => ({
      ...item,
      categoryInfo: News.getCategoryInfo(item.category),
    }));

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
    console.error("Error in getAllNews:", e);
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

    const news = await News.findById(id)
      .populate("author", "firstName lastName email profilePicture")
      .lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

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

// Update news
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID!",
      });
    }

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    // Update fields
    Object.keys(updateData).forEach((key) => {
      if (key !== "author" && key !== "_id") {
        news[key] = updateData[key];
      }
    });

    await news.save();

    const updatedNews = await News.findById(news._id)
      .populate("author", "firstName lastName email")
      .lean();

    res.status(200).json({
      success: true,
      message: "News updated successfully!",
      data: updatedNews,
    });
  } catch (e) {
    console.error("Error in updateNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to update news",
    });
  }
};

// Delete news (soft delete)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID!",
      });
    }

    const news = await News.findByIdAndUpdate(
      id,
      { isActive: false, status: "archived" },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "News deleted successfully!",
    });
  } catch (e) {
    console.error("Error in deleteNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to delete news",
    });
  }
};

// Publish news
const publishNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID!",
      });
    }

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    news.status = "published";
    if (!news.publishedAt) {
      news.publishedAt = new Date();
    }
    await news.save();

    const publishedNews = await News.findById(news._id)
      .populate("author", "firstName lastName email")
      .lean();

    res.status(200).json({
      success: true,
      message: "News published successfully!",
      data: publishedNews,
    });
  } catch (e) {
    console.error("Error in publishNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to publish news",
    });
  }
};

// Unpublish news (back to draft)
const unpublishNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID!",
      });
    }

    const news = await News.findByIdAndUpdate(
      id,
      { status: "draft" },
      { new: true }
    ).populate("author", "firstName lastName email");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "News unpublished successfully!",
      data: news,
    });
  } catch (e) {
    console.error("Error in unpublishNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to unpublish news",
    });
  }
};

// Toggle pin status
const togglePinNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID!",
      });
    }

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found!",
      });
    }

    news.isPinned = !news.isPinned;
    await news.save();

    res.status(200).json({
      success: true,
      message: `News ${news.isPinned ? "pinned" : "unpinned"} successfully!`,
      data: { isPinned: news.isPinned },
    });
  } catch (e) {
    console.error("Error in togglePinNews:", e);
    res.status(500).json({
      success: false,
      message: "Failed to toggle pin status",
    });
  }
};

// Get news statistics
const getNewsStatistics = async (req, res) => {
  try {
    const totalNews = await News.countDocuments({ isActive: true });
    const publishedNews = await News.countDocuments({
      isActive: true,
      status: "published",
    });
    const draftNews = await News.countDocuments({
      isActive: true,
      status: "draft",
    });
    const pinnedNews = await News.countDocuments({
      isActive: true,
      isPinned: true,
    });

    // Total views
    const viewStats = await News.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewCount" },
        },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await News.aggregate([
      { $match: { isActive: true, status: "published" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Add category info to breakdown
    const categoryBreakdownWithInfo = categoryBreakdown.map((item) => ({
      category: item._id,
      categoryInfo: News.getCategoryInfo(item._id),
      count: item.count,
    }));

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNews = await News.countDocuments({
      isActive: true,
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        totalNews,
        publishedNews,
        draftNews,
        pinnedNews,
        totalViews: viewStats.length > 0 ? viewStats[0].totalViews : 0,
        recentNews,
        categoryBreakdown: categoryBreakdownWithInfo,
      },
    });
  } catch (e) {
    console.error("Error in getNewsStatistics:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news statistics",
    });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  publishNews,
  unpublishNews,
  togglePinNews,
  getNewsStatistics,
};