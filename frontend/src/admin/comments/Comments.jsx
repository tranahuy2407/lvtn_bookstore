import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../authencation/AuthContext';

const Comments = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({});
  const { admin } = useAuth();
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

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
    console.log('Replying to commentId:', commentId); // Log commentId directly
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
        } else {
          console.error('Có lỗi xảy ra khi trả lời bình luận.');
        }
      } catch (error) {
        console.error('Có lỗi xảy ra khi gửi yêu cầu trả lời bình luận:', error);
      }
    }
  };
  

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách sách có bình luận</h2>
      {books.length === 0 ? (
        <p>Không có sách nào có bình luận.</p>
      ) : (
        books.map((book) => (
          <div key={book._id} className="flex border border-gray-200 p-4 mb-4 rounded-lg">
            <div className="w-1/3 pr-4">
              <img src={book.images} alt={book.name} className="w-full h-auto object-cover rounded-lg" />
            </div>
            <div className="w-2/3">
              <h3 className="text-xl font-semibold mb-2">{book.name}</h3>
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Bình luận</h4>
                {book.comments.length === 0 ? (
                  <p>Không có bình luận nào.</p>
                ) : (
                  book.comments.map((comment) => (
                    <div key={comment._id} className="border-b border-gray-300 pb-2 mb-2">
                      <p><strong>{userNames[comment.userId?._id.toString()] || 'Người dùng không xác định'}:</strong> {comment.comments}</p>
                      {comment.reply && (
                        <div className="ml-4 text-gray-600">
                          <p>{comment.reply}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleReplyClick(comment._id)}
                        className="text-blue-500 hover:underline"
                      >
                        Reply
                      </button>
                      {replyingCommentId === comment._id && (
                        <div className="mt-2">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                            placeholder="Viết trả lời của bạn..."
                          ></textarea>
                         <button
                          onClick={() => handleReplySubmit(comment._id, book._id)} 
                          className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
                        >
                          Gửi
                        </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2">Đánh giá</h4>
                {book.ratings.length === 0 ? (
                  <p>Chưa có đánh giá nào.</p>
                ) : (
                  book.ratings.map((rating) => (
                    <div key={rating._id} className="border-b border-gray-300 pb-2 mb-2">
                      <p><strong>{userNames[rating.userId?._id.toString()] || 'Người dùng không xác định'}:</strong> {rating.rating} sao</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
