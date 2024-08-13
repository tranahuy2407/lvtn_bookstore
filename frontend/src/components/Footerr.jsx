import React from 'react';
import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter, BsPinterest } from "react-icons/bs";
import { FaTumblr } from 'react-icons/fa';

const Footerr = () => {
  return (
    <Footer bgDark>
      <div className="w-full px-4 lg:px-24">
        <div className="grid w-full grid-cols-1 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <Footer.LinkGroup col>
              <p>180 Cao Lỗ, Phường 4 Quận 8 TP HCM</p>
              <p>HS BookStore nhận đặt hàng trực tuyến và giao hàng tận nơi.</p>
              <p>KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng HS BookStore trên toàn quốc.</p>
            </Footer.LinkGroup>
            <div className="mt-4 flex space-x-6">
              <Footer.Icon href="#" icon={BsFacebook} />
              <Footer.Icon href="#" icon={BsInstagram} />
              <Footer.Icon href="#" icon={BsTwitter} />
              <Footer.Icon href="#" icon={BsPinterest} />
              <Footer.Icon href="#" icon={FaTumblr} />
            </div>
          </div>
          <div>
            <Footer.Title title="Dịch vụ" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Điều khoản sử dụng</Footer.Link>
              <Footer.Link href="#">Chính sách bảo mật thông tin cá nhân</Footer.Link>
              <Footer.Link href="#">Chính sách bảo mật thanh toán</Footer.Link>
              <Footer.Link href="#">Giới thiệu HS BookStore</Footer.Link>
              <Footer.Link href="#">Hệ thống trung tâm - nhà sách</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Hỗ trợ" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Chính sách đổi - trả - hoàn tiền</Footer.Link>
              <Footer.Link href="#">Chính sách bảo hành - bồi hoàn</Footer.Link>
              <Footer.Link href="#">Chính sách vận chuyển</Footer.Link>
              <Footer.Link href="#">Chính sách khách sỉ</Footer.Link>
              <Footer.Link href="#">Phương thức thanh toán và xuất HĐ</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Tài khoản của tôi" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Đăng nhập/Tạo mới tài khoản</Footer.Link>
              <Footer.Link href="#">Thay đổi địa chỉ khách hàng</Footer.Link>
              <Footer.Link href="#">Chi tiết tài khoản</Footer.Link>
              <Footer.Link href="#">Lịch sử mua hàng</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
        <div className="w-full bg-gray-700 px-4 py-6 sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Flowbite™" year={2024} />
        </div>
      </div>
    </Footer>
  );
}

export default Footerr;
