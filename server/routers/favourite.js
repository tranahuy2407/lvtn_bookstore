const express = require("express");
const favouriteRouter = express.Router();
const Favourite = require("../models/favourite");

//DS yêu thích cảu user qua ID
favouriteRouter.get("/favorite/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const favorite = await Favourite.findOne({ userId }).populate("bookIds");
        
        if (!favorite) {
            return res.json([]);
        }
        res.json(favorite.bookIds.map(book => book._id));
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: error.message });
    }
});

  // Thêm vào yêu thích
  favouriteRouter.post("/add-favorite", async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        let favourite = await Favourite.findOne({ userId });

        if (!favourite) {
            favourite = new Favourite({
                userId,
                bookIds: [bookId]  
            });
            await favourite.save();
            return res.status(201).json(favourite);
        }

        if (favourite.bookIds.includes(bookId)) {
            return res.status(200).json(favourite);
        }

        favourite.bookIds.push(bookId);
        await favourite.save();
        res.status(201).json(favourite);
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Failed to add favorite" });
    }
});


  // XÓa khỏi ds têu thích
  favouriteRouter.delete("/remove-favorite", async (req, res) => {
    const { userId, bookId } = req.body; 

    try {
        let favourite = await Favourite.findOne({ userId });
        
        if (!favourite || !favourite.bookIds.includes(bookId)) {
            return res.status(404).json({ message: "Favorite not found" });
        }
        favourite.bookIds = favourite.bookIds.filter(id => id.toString() !== bookId);
        await favourite.save();
        if (favourite.bookIds.length === 0) {
            await Favourite.findOneAndDelete({ userId });
            return res.json({ message: "Favorite list deleted successfully" });
        }

        res.json({ message: "Favorite removed successfully", favourite });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: error.message });
    }
});



module.exports = favouriteRouter;