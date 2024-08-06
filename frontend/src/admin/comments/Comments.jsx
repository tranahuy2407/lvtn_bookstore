import React, { useState, useEffect } from 'react';
import { useAuth } from '../authencation/AuthContext';
import { Table, Button, Modal } from 'antd';

const Comments = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({});
  const { admin } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books-with-comments');
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
          const userIds = new Set();
          data.forEach(book => {
            book.comments.forEach(comment => {
              const userId = comment.userId?._id || comment.userId;
              if (userId) {
                userIds.add(userId);
              }
            });
          });
          await fetchUserNames(userIds);
        } else {
          setError('Không thể tải dữ liệu sách.');
        }
      } catch (err) {
        setError('Có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserNames = async (userIds) => {
      const userNamePromises = Array.from(userIds).map(async (userId) => {
        try {
          const userResponse = await fetch(`http://localhost:5000/api/getusername/${userId}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            return { userId, name: userData.name };
          } else {
            return { userId, name: 'Người dùng không xác định' };
          }
        } catch (error) {
          console.error(`Error fetching username for userId ${userId}:`, error);
          return { userId, name: 'Người dùng không xác định' };
        }
      });
      const userNameResults = await Promise.all(userNamePromises);
      const userNamesMap = userNameResults.reduce((acc, { userId, name }) => {
        acc[userId] = name;
        return acc;
      }, {});
      setUserNames(userNamesMap);
    };

    fetchBooks();
  }, []);

  const handleReplyClick = (commentId) => {
    setReplyingCommentId(commentId);
    setReplyModalVisible(true); // Mở modal trả lời khi nhấn nút trả lời
  };

  const handleReplySubmit = async (commentId, bookId) => {
    if (replyContent.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/${bookId}/${commentId}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reply: replyContent, adminId: admin?._id }),
        });

        if (response.ok) {
          const updatedBooks = books.map(book => {
            if (book._id === bookId) {
              return {
                ...book,
                comments: book.comments.map(comment => {
                  if (comment._id === commentId) {
                    return {
                      ...comment,
                      reply: replyContent,
                      adminId: admin?._id,
                    };
                  }
                  return comment;
                })
              };
            }
            return book;
          });
          setBooks(updatedBooks);
          setReplyingCommentId(null);
          setReplyContent("");
          setReplyModalVisible(false); // Đóng modal trả lời sau khi gửi
        } else {
          console.error('Có lỗi xảy ra khi trả lời bình luận.');
        }
      } catch (error) {
        console.error('Có lỗi xảy ra khi gửi yêu cầu trả lời bình luận:', error);
      }
    }
  };

  const handleDetailClick = (book) => {
    setSelectedBook(book);
    setDetailsModalVisible(true);
  };

  const handleModalCancel = () => {
    setDetailsModalVisible(false);
    setSelectedBook(null);
  };

  const handleReplyModalCancel = () => {
    setReplyModalVisible(false);
    setReplyContent("");
  };

  const bookColumns = [
    {
      title: 'Hình Ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (text) => <img src={text} alt="Book cover" style={{ width: 100, height: 150, objectFit: 'cover' }} />,
    },
    {
      title: 'Tên Sách',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chi Tiết',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleDetailClick(record)} type="primary">
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const commentColumns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (text, record) => (
        <span>{userNames[record.userId?._id.toString()] || 'Người dùng không xác định'}</span>
      ),
    },
    {
      title: 'Bình luận',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: 'Trả lời',
      dataIndex: 'reply',
      key: 'reply',
      render: (text) => text || 'Chưa có trả lời',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (text, record) => (
        <span>{record.reply ? 'Đã trả lời' : 'Chưa trả lời'}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleReplyClick(record._id)}
            className="text-blue-500"
          >
            Trả lời
          </Button>
        </>
      ),
    },
  ];

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách sách có bình luận</h2>
      <Table
        dataSource={books}
        columns={bookColumns}
        rowKey="_id"
        pagination={false}
      />
      {selectedBook && (
        <Modal
          title={selectedBook.name}
          visible={detailsModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={1000} // Thay đổi kích thước của modal
        >
          <h4 className="text-lg font-medium mb-2">Bình luận</h4>
          <Table
            dataSource={selectedBook.comments}
            columns={commentColumns}
            rowKey="_id"
            pagination={false}
          />
        </Modal>
      )}
      {replyModalVisible && (
        <Modal
          title="Trả lời bình luận"
          visible={replyModalVisible}
          onCancel={handleReplyModalCancel}
          footer={null}
        >
          <h4 className="text-lg font-medium mb-2">Nhập trả lời</h4>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows="3"
            placeholder="Viết trả lời của bạn..."
          ></textarea>
          <Button
            onClick={() => handleReplySubmit(replyingCommentId, selectedBook._id)}
            className="mt-2 bg-blue-500 text-white"
          >
            Gửi
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default Comments;
