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
            path:"/invoice",
            element: <Invoice/>
        },
        {
            path:"/search",
            element: <Search/>
        },
        {
            path:"/admin/dashboard",
            element: <DashBoardLayout/>,
            children: [ 
                {
                    path:"/admin/dashboard",
                    element: <DashBoard/>
                },
               
            ]
        }
    ]
  },
]);

export default router;
