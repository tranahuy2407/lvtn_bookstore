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
	
	// 		{
	// 			key: 'messages',
	// 			label: 'Bình luận',
	// 			path: '/messages',
	// 			icon: <HiOutlineAnnotation />
	// 		}

	// {
	// 	key: 'customers',
	// 	label: 'Customers',
	// 	path: '/customers',
	// 	icon: <HiOutlineUsers />
	// },
	
	// {
	// 	key: 'updatepublishers',
	// 	label: 'Sửa nhà xuất bản',
	// 	path: '/admin/dashboard/updatepublishers/:id',
	// 	icon: <HiOutlineDocumentText />
	// },

	

	
]

// export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
// 	{
// 		key: 'settings',
// 		label: 'Settings',
// 		path: '/settings',
// 		icon: <HiOutlineCog />
// 	},
// 	{
// 		key: 'support',
// 		label: 'Help & Support',
// 		path: '/support',
// 		icon: <HiOutlineQuestionMarkCircle />
// 	}
// ]