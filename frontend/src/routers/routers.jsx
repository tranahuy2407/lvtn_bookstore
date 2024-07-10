import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App"
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
        {
            path: "/",
            element: <Home  />
        },
        {
            path: "/all-shop",
            element: <Shop/>,
        },
        {
            path: "/shop/:id",
            element: <ShopByCategory/>,
        },
        {
            path: "/shop/promotion/:id",
            element: <ShopByPromotion/>,
        },
        
        {
            path: "/about",
            element: <About/>
        },
        {
            path: "/news",
            element: <News/>
        },
        {
            path: "/signup",
            element: <SignUpPage/>
        },
        {
            path: "/login",
            element: <LoginPage/>
        },
        {
            path: "/account",
            element: <AccountPage/>
        },
        {
            path: "/account/:subpage?",
            element: <AccountPage/>
        },
        {
            path:"/book/:id",
            element: <SingleBook/>,
            loader: ({params})=>fetch(`http://localhost:5000/api/products/${params.id}`)
        },
     
        {
            path:"/account/:subpage/:action",
            element: <Favourites/>
        },
        {
            path:"/account/:subpage/:action",
            element: <OrderMe/>
        },
        {
            path:"/account/:subpage/:action",
            element: <OrderHistory/>
        },
        {
            path: "/account/myorders/:orderId",
            element: <OrderDetail/>,
            loader: ({params})=>fetch(`http://localhost:5000/order/${params.id}`)
        },
        {
            path:"/cart",
            element: <Cart/>
        },
        {
            path:"/checkout",
            element: <Checkout/>
        },
        {
            path:"/invoice/:orderId",
            element: <Invoice/>
        },
        {
            path:"/order-success",
            element: <OrderSuccess/>
        },
        {
            path:"/search",
            element: <Search/>
        },
      
    ]
  },
  {
    path:"/admin/dashboard",
    element: <DashBoardLayout/>,
    children: [
        {
            path:"/admin/dashboard",
            element: <DashBoard/>
        },

        {
            path:"/admin/dashboard/products",
            element: <Products/>
        },

        {
            path: "/admin/dashboard/add-product",
            element: <AddProduct /> 
        },
        {
            path:"/admin/dashboard/publishers",
            element: <Publishers />
        },

        {
            path:"/admin/dashboard/addpublishers",
            element: <AddPublisher />
        },
        {
            path: "/admin/dashboard/updatepublishers/:id",
            element: <EditPublisherForm /> 
        },
        {
            path:"/admin/dashboard/categories",
            element: <Categories />
        },
        {
            path:"/admin/dashboard/addcategories",
            element: <AddCategory />
        },
        {
            path: "/admin/dashboard/updatecategory/:categoryId",
            element: <UpdateCategory /> 
        },
        {
            path:"/admin/dashboard/orders",
            element: <Order />
        },
        {
            path:"/admin/dashboard/promotions",
            element: <Promotions />
        },
        {
            path:"/admin/dashboard/addpromotion",
            element: <AddPromotion />
        },
        {
            path:"/admin/dashboard/authors",
            element: <Authors />
        },
        {
            path:"/admin/dashboard/addauthors",
            element: <AddAuthor />
        },
        {
            path: "/admin/dashboard/updateauthor/:authorId",
            element: <UpdateAuthor /> 
        },
    ]
}
]);

export default router;
