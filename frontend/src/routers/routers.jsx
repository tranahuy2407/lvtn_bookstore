import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import News from "../components/News";
import Favourites from "../components/Favourites";
import SingleBook from "../shop/SingleBook";
import DashBoardLayout from "../admin/DashBoardLayout";
import DashBoard from "../admin/DashBoard";
import LoginPage from "../authencation/LoginPage";
import SignUpPage from "../authencation/SignUpPage";
import Cart from "../shop/Cart";
import AccountPage from "../authencation/AccountPage";
import Checkout from "../shop/Checkout";
import Invoice from "../shop/Invoice";
import OrderMe from "../components/OrderMe";
import ShopByCategory from "../shop_by_category/ShopByCategory";
import Search from "../components/Search";
import ShopByPromotion from "../shop_by_category/ShopByPromotion";
import OrderDetail from "../components/OderDetail";
import Products from "../admin/components/Products";
import AddProduct from "../admin/components/AddProduct";
import Publishers from "../admin/components/Publishers";
import AddPublisher from "../admin/components/AddPublishers";
import Categories from "../admin/components/Categories";
import EditPublisherForm from "../admin/components/UpdatePublisher";
import AddCategory from "../admin/components/AddCategories";
import UpdateCategory from "../admin/components/UpdateCategory";
import Order from "../admin/components/Orders";
import Promotions from "../admin/components/Promotions";
import AddPromotion from "../admin/components/AddPromotion";
import Authors from "../admin/components/Authors";
import AddAuthor from "../admin/components/AddAuthor";
import UpdateAuthor from "../admin/components/UpdateAuthor";
import OrderHistory from "../components/OrderHistory";
import OrderSuccess from "../shop/OrderSuccess";
import Rating from "../components/Rating";
import CreateBookReceipt from "../admin/bookreceipt/CreateBookReceipt";
import Suppliers from "../admin/bookreceipt/Suppliers";
import Comments from "../admin/comments/Comments";
import AddSupplier from "../admin/bookreceipt/AddSuppliers";
import UpdateSupplier from "../admin/bookreceipt/UpdateSuppliers";
import CategoryBookReceipt from "../admin/bookreceipt/CategoryBookReceipt";
import AdminNews from "../admin/news/AdminNews";
import AddNews from "../admin/news/AddNews";
import UpdateNews from "../admin/news/UpdateNews";
import Request from "../admin/customer-service/Request";
import ViewBookReceipt from "../admin/bookreceipt/ViewBookReceipt";
import EditBookReceipt from "../admin/bookreceipt/EditBookReceipt";
import LoginAdmin from '../admin/authencation/LoginAdmin'; 
import ProtectedRoute from '../admin/authencation/ProtectedRoute'; 
import ForgotPassword from "../authencation/ForgotPassword";
import ResetPassword from "../authencation/ResetPassword";
import ProtectedRouteUser from './ProtectedRouteUser'; 
import Shop_By_Author from "../shop_by_category/Shop_By_Author";
import Program from "../admin/components/Program";
import AddProgram from "../admin/components/AddProgram";

const router = createBrowserRouter([
  // User routes
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/all-shop", element: <Shop /> },
      { path: "/shop/:id", element: <ShopByCategory /> },
      { path: "/shop/program-promotion/:id", element: <ShopByPromotion /> },
      { path: "/shop-by-author/:authorId", element: <Shop_By_Author />},
      { path: "/about", element: <About /> },
      { path: "/news", element: <News /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/account", element: <AccountPage /> },
      { path: "/account/:subpage?", element: <AccountPage /> },
      { path: "/book/:id", 
        element: <SingleBook/>, 
        loader: ({ params }) => fetch(`http://localhost:5000/api/products/${params.id}`) },
      { path: "/account/:subpage/:action", element: <Favourites /> },
      { path: "/account/:subpage/:action", element: <OrderMe /> },
      { path: "/account/:subpage/:action", element: <OrderHistory /> },
      { 
        path: "/account/myorders/:orderId", 
        element: <ProtectedRouteUser element={<OrderDetail />} />, 
        loader: ({ params }) => fetch(`http://localhost:5000/order/${params.orderId}`)
      },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/invoice/:orderId", 
        element: <ProtectedRouteUser element={<Invoice/>} /> },
      { path: "/order-success", element: <OrderSuccess /> },
      { path: "/search", element: <Search /> },
      { path: "/ratings/:orderId", element: <Rating /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
    ]
  },
  
  // Admin routes
  {
    path: "/admin/login",
    element: <LoginAdmin />,
  },
  {
    path: "/admin/dashboard",
    element: <ProtectedRoute element={<DashBoardLayout />} />,
    children: [
      { path: "", element: <DashBoard /> },
      { path: "products", element: <Products /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "publishers", element: <Publishers /> },
      { path: "addpublishers", element: <AddPublisher /> },
      { path: "updatepublishers/:id", element: <EditPublisherForm /> },
      { path: "categories", element: <Categories /> },
      { path: "addcategories", element: <AddCategory /> },
      { path: "updatecategory/:categoryId", element: <UpdateCategory /> },
      { path: "orders", element: <Order /> },
      { path: "promotions", element: <Promotions /> },
      { path: "addpromotion", element: <AddPromotion /> },
      { path: "authors", element: <Authors /> },
      { path: "addauthors", element: <AddAuthor /> },
      { path: "updateauthor/:authorId", element: <UpdateAuthor /> },
      { path: "bookreceipts", element: <CreateBookReceipt /> },
      { path: "suppliers", element: <Suppliers /> },
      { path: "comments", element: <Comments /> },
      { path: "addsuppliers", element: <AddSupplier /> },
      { path: "updatesuppliers/:supplierId", element: <UpdateSupplier /> },
      { path: "categories-bookreceipt", element: <CategoryBookReceipt /> },
      { path: "news", element: <AdminNews /> },
      { path: "addnews", element: <AddNews /> },
      { path: "updatenews/:newsId", element: <UpdateNews /> },
      { path: "request-return", element: <Request /> },
      { path: "book-receipt/view/:id", element: <ViewBookReceipt /> },
      { path: "book-receipt/edit/:id", element: <EditBookReceipt /> },
      { path: "program", element: <Program /> },
      { path: "addprogram", element: <AddProgram /> },
    ]
  }
]);

export default router;
