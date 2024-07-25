const express = require("express");
const mongoose = require("mongoose");

const adminRouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const bookRouter = require("./routers/book");
const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const authorRouter = require("./routers/author");
const promotionRouter = require("./routers/promotion");
const favouriteRouter = require("./routers/favourite");
const publisherRouter = require("./routers/publisher");
const orderRouter = require("./routers/order");
const invoiceRouter = require("./routers/invoice");
const bookReceiptRouter = require("./routers/bookreceipt");
const newRouter = require("./routers/new");
const commentRouter = require("./routers/comment");

const PORT = process.env.PORT || 5000;
const app = express();
const DB = "mongodb://127.0.0.1:27017/lvtn";

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,       
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(bookRouter);
app.use(userRouter);
app.use(categoryRouter);
app.use(authorRouter);
app.use(publisherRouter);
app.use(promotionRouter);
app.use(favouriteRouter);
app.use(orderRouter);
app.use(invoiceRouter);
app.use(bookReceiptRouter);
app.use(newRouter);
app.use(commentRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Kết nối thành công !");
  })
  .catch((e) => {
    console.log(e);
  });
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Kết nối tại port ${PORT}`);
});
