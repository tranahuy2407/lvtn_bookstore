const express = require("express");
const programRouter = express.Router();
const Program = require("../models/program_promotions");

// API để lấy danh sách các chương trình giảm giá với status = 1
programRouter.get("/programs", async (req, res) => {
    try {
        const programs = await Program.find({ status: 1 }).populate('promotions');
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

// API để thêm chương trình giảm giá mới
programRouter.post("/programs", async (req, res) => {
    const { name, image, status, description, promotions } = req.body;
    try {
        const newProgram = new Program({ name, image, status, description, promotions });
        await newProgram.save();
        res.status(201).json({ message: "Chương trình đã được thêm thành công.", program: newProgram });
    } catch (error) {
        res.status(500).json({ message: "Đã xảy ra lỗi khi thêm chương trình." });
    }
});

// API để cập nhật chương trình giảm giá theo ID
programRouter.put("/api/updateprogram/:id", async (req, res) => {
    const programId = req.params.id;
    const updateData = req.body;

    try {
        const updatedProgram = await Program.findByIdAndUpdate(programId, updateData, { new: true }).populate('promotions');

        if (!updatedProgram) {
            return res.status(404).json({ message: "Không tìm thấy chương trình để cập nhật" });
        }

        res.status(200).json({ message: "Cập nhật thành công", program: updatedProgram });
    } catch (error) {
        console.error("Lỗi khi cập nhật chương trình:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
});


// API để xóa chương trình giảm giá theo ID
programRouter.delete("/api/deleteprogram/:id", async (req, res) => {
    const programId = req.params.id;

    try {
        const deletedProgram = await Program.findByIdAndDelete(programId);

        if (!deletedProgram) {
            return res.status(404).json({ message: "Không tìm thấy chương trình để xóa" });
        }

        res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa chương trình:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    }
});


module.exports = programRouter;
