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

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Bảng thống kê',
		path: '/admin/dashboard',
		icon: <HiOutlineViewGrid />
	},
	
	{
		key: 'manageproducts',
		label: 'Sản phẩm',
		icon: <HiOutlineCube />,
		children: [
			{
				key: 'products',
				label: 'Danh sách sản phẩm',
				path: '/admin/dashboard/products',
				icon: <HiOutlineCube />
			},
			{
				key: 'addproducts',
				label: 'Thêm sản phẩm',
				path: '/admin/dashboard/add-product',
				icon: <HiOutlineCube />
			}
		],
	},
	{
		key: 'managecategories',
		label: 'Thể loại',
		icon: <HiOutlineCube />,
		children: [
			{
				key: 'categories',
				label: 'Danh sách thể loại',
				path: '/admin/dashboard/categories',
				icon: <HiOutlineDocumentText />
			},
			{
				key: 'addcategories',
				label: 'Thêm thể loại',
				path: '/admin/dashboard/addcategories',
				icon: <HiOutlineDocumentText />
			},
		],
	},

	{
		key: 'managepublishers',
		label: 'Nhà xuất bản',
		icon: <HiOutlineCube />,
		children: [
			{
				key: 'publishers',
				label: 'Danh sách nhà xuất bản',
				path: '/admin/dashboard/publishers',
				icon: <HiOutlineDocumentText />
			},
			{
				key: 'addpublishers',
				label: 'Thêm nhà xuất bản',
				path: '/admin/dashboard/addpublishers',
				icon: <HiOutlineDocumentText />
			},
		]
	},

	{
		key: 'manageauthor',
		label: 'Tác giả',
		icon: <HiOutlineCube />,
		children: [
			{
				key: 'publishers',
				label: 'Danh sách tác giả',
				path: '/admin/dashboard/authors',
				icon: <HiOutlineDocumentText />
			},
			{
				key: 'addpublishers',
				label: 'Thêm tác giả',
				path: '/admin/dashboard/addauthors',
				icon: <HiOutlineDocumentText />
			},
		]
	},

	{
		key: 'manageorder',
		label: 'Quản lí đơn hàng',
		icon: <HiOutlineCube />,
		children: [
			
			{
				key: 'orders',
				label: 'Danh sách đơn hàng',
				path: '/admin/dashboard/orders',
				icon: <HiOutlineShoppingCart />
			},
		]
	},
				
	{
		key: 'manageopromotion',
		label: 'Quản lí khuyến mãi',
		icon: <HiOutlineCube />,
		children: [
			
			{
				key: 'promotions',
				label: 'Danh sách khuyến mãi',
				path: '/admin/dashboard/promotions',
				icon: <HiOutlineDocumentText />
			},
			{
				key: 'addpromotion',
				label: 'Thêm mã khuyến mãi',
				path: '/admin/dashboard/addpromotion',
				icon: <HiOutlineDocumentText />
			},
		]
	},
	{
		key: 'managecomment',
		label: 'Quản lý bình luận',
		icon: <HiOutlineCube />,
		children: [
			
			{
				key: 'comments',
				label: 'Danh sách bình luận',
				path: '/admin/dashboard/comments',
				icon: <HiOutlineDocumentText />
			},
		]
	},
	{
		key: 'managenew',
		label: 'Quản lý tin tức',
		icon: <HiOutlineCube />,
		children: [
			
			{
				key: 'new',
				label: 'Danh sách tin tức',
				path: '/admin/dashboard/news',
				icon: <HiOutlineDocumentText />
			},
			
		]
	},
	{
		key: 'managebookreceipt',
		label: 'Quản lý nhập hàng',
		icon: <HiOutlineCube />,
		children: [
			
			{
				key: 'bookreceipts',
				label: 'Nhập hàng',
				path: '/admin/dashboard/bookreceipts',
				icon: <HiOutlineDocumentText />
			},
			{
				key: 'categories-bookreceipt',
				label: 'Quản lý phiếu nhập',
				path: '/admin/dashboard/categories-bookreceipt',
				icon: <HiOutlineDocumentText />
			},
			{
				key: 'supplier',
				label: 'Quản lý nhà cung cấp',
				path: '/admin/dashboard/suppliers',
				icon: <HiOutlineDocumentText />
			},
		]
	},
	{
		key: 'managenew',
		label: 'Quản lý đổi trả',
		icon: <HiOutlineCube />,
		children: [
			
			{
				key: 'request-return',
				label: 'Danh sách yêu cầu',
				path: '/admin/dashboard/request-return',
				icon: <HiOutlineDocumentText />
			},
			
		]
	},
]
