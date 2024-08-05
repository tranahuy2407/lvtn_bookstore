const express = require("express");
const programRouter = express.Router();
const Program = require("../models/program_promotions");

 // API để lấy danh sách các chương trình giảm giá
programRouter.get("/programs", async (req, res) => {
    try {
         const programs = await Program.find().populate('promotions'); 
                res.status(200).json(programs);
            } catch (error) {
                res.status(500).json({ message: "Đã xảy ra lỗi khi lấy dữ liệu chương trình." });
        }
    });

 // API để lấy chương trình giảm giá theo ID
programRouter.get("/programs/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const program = await Program.findById(id).populate('promotions');
        if (!program) {
            return res.status(404).json({ message: "Chương trình không tìm thấy." });
        }
        res.status(200).json(program);
    } catch (error) {
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy dữ liệu chương trình." });
    }
});

    module.exports = programRouter;