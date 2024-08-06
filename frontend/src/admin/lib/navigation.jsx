import { Children } from 'react'
import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'
import { 
	FcShop,
	FcBusinessman,
	FcManager,
	FcHome,
	FcComments,
	FcDocument,
	FcAutomotive,
	FcBarChart,
	FcInTransit ,
	FcNews,
	FcMenu,
	FcBookmark,
	FcRedo,
	FcAdvertising,
	FcList,
	FcPlus,
	FcPortraitMode,
} from "react-icons/fc";
import { MdShoppingCartCheckout } from "react-icons/md";

import { FaBook } from "react-icons/fa";

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Bảng thống kê',
		path: '/admin/dashboard',
		icon: <FcBarChart />
	},
	
	{
		key: 'manageproducts',
		label: 'Sản phẩm',
		icon: <FcBookmark />,
		children: [
			{
				key: 'products',
				label: 'Danh sách sản phẩm',
				path: '/admin/dashboard/products',
				icon: <FcList />
			},
			{
				key: 'addproducts',
				label: 'Thêm sản phẩm',
				path: '/admin/dashboard/add-product',
				icon: <FcPlus />
			}
		],
	},
	{
		key: 'managecategories',
		label: 'Thể loại',
		icon: <FcMenu />,
		children: [
			{
				key: 'categories',
				label: 'Danh sách thể loại',
				path: '/admin/dashboard/categories',
				icon: <FcList />
			},
			{
				key: 'addcategories',
				label: 'Thêm thể loại',
				path: '/admin/dashboard/addcategories',
				icon: <FcPlus />
			},
		],
	},

	{
		key: 'managepublishers',
		label: 'Nhà xuất bản',
		icon: <FcManager />,
		children: [
			{
				key: 'publishers',
				label: 'Danh sách nhà xuất bản',
				path: '/admin/dashboard/publishers',
				icon: <FcList />
			},
			{
				key: 'addpublishers',
				label: 'Thêm nhà xuất bản',
				path: '/admin/dashboard/addpublishers',
				icon: <FcPlus />
			},
		]
	},

	{
		key: 'manageauthor',
		label: 'Tác giả',
		icon: <FcBusinessman />,
		children: [
			{
				key: 'publishers',
				label: 'Danh sách tác giả',
				path: '/admin/dashboard/authors',
				icon: <FcList />
			},
			{
				key: 'addpublishers',
				label: 'Thêm tác giả',
				path: '/admin/dashboard/addauthors',
				icon: <FcPlus />
			},
		]
	},

	{
		key: 'manageorder',
		label: 'Quản lí đơn hàng',
		icon: <FcInTransit />,
		children: [
			
			{
				key: 'orders',
				label: 'Danh sách đơn hàng',
				path: '/admin/dashboard/orders',
				icon: <FcAutomotive />
			},
		]
	},
				
	{
		key: 'manageopromotion',
		label: 'Quản lí khuyến mãi',
		icon: <FcAdvertising />,
		children: [
			
			{
				key: 'promotions',
				label: 'Danh sách khuyến mãi',
				path: '/admin/dashboard/promotions',
				icon: <FcList />
			},
			{
				key: 'addpromotion',
				label: 'Thêm mã khuyến mãi',
				path: '/admin/dashboard/addpromotion',
				icon: <FcPlus />
			},
			{
				key: 'program',
				label: 'Chương trình khuyến mãi',
				path: '/admin/dashboard/program',
				icon: <HiOutlineDocumentText />
			},
		]
	},
	{
		key: 'managecomment',
		label: 'Quản lý bình luận',
		icon: <FcComments />,
		children: [
			
			{
				key: 'comments',
				label: 'Danh sách bình luận',
				path: '/admin/dashboard/comments',
				icon: <FcList />
			},
		]
	},
	{
		key: 'managenew',
		label: 'Quản lý tin tức',
		icon: <FcNews />,
		children: [
			
			{
				key: 'new',
				label: 'Danh sách tin tức',
				path: '/admin/dashboard/news',
				icon: <FcList />
			},
			
		]
	},
	{
		key: 'managebookreceipt',
		label: 'Quản lý nhập hàng',
		icon: <FcShop />,
		children: [
			
			{
				key: 'bookreceipts',
				label: 'Nhập hàng',
				path: '/admin/dashboard/bookreceipts',
				icon: <FcPlus />
			},
			{
				key: 'categories-bookreceipt',
				label: 'Quản lý phiếu nhập',
				path: '/admin/dashboard/categories-bookreceipt',
				icon: <FcList />
			},
			{
				key: 'supplier',
				label: 'Quản lý nhà cung cấp',
				path: '/admin/dashboard/suppliers',
				icon: <FcPortraitMode />
			},
		]
	},
	{
		key: 'managerequest-return',
		label: 'Quản lý đổi trả',
		icon: <FcRedo />,
		children: [
			
			{
				key: 'request-return',
				label: 'Danh sách yêu cầu',
				path: '/admin/dashboard/request-return',
				icon: <FcList />
			},
			
		]
	},
]
