import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllUser, getAllPost } from '../../stores/post/postActions';
import { Card, Image, Modal, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ getAllUser, getAllPost, posts, users }) => {
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getAllUser();
    getAllPost();
  }, []);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      .then((response) => {
        if (response.status === 200) {
          setComments(response.data);
          setLoading(false);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => console.log(error));
  }, [postId]);

  const ModalComments = (props) => {
    return (
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          {loading ? (
            <div className="loading">
              <Spinner animation="grow" role="status" variant="primary" />
            </div>
          ) : (
            comments.map((comment) => {
              return (
                <div key={comment.id} className="comment">
                  <div className="author">
                    <Image
                      className="avatar-user"
                      src="https://scontent.fcgk8-2.fna.fbcdn.net/v/t1.30497-1/cp0/p56x56/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEYrehBEDWDPawY48sH9ilzso2H55p0AlGyjYfnmnQCUVkEbPAx1MrmFc03wDBF08Pn3JJawx3IQ3OjxIjqy2-C&_nc_ohc=d5JXCdeo3tYAX9uE6aK&_nc_ht=scontent.fcgk8-2.fna&oh=00_AT-TJNXQ2XLyxnP0Ie7WB8jfC75S8d7Ssn6KFY4vNvzWEw&oe=6204144E"
                    />
                    <h6 className="author-name">{comment.name}</h6>
                  </div>
                  <p>{comment.body}</p>
                </div>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  function renderPostSection() {
    return (
      <>
        {posts.map((post) => {
          const currentUser = users.find((user) => user.id == post.userId);
          return (
            <Card key={post.id} className="post-list" border="info" bg="light">
              <Link to={`/user/${currentUser.id}`}>
                <Card.Header as="h5" className="header-post">
                  <Image
                    className="avatar-user"
                    src="https://scontent.fcgk8-2.fna.fbcdn.net/v/t1.30497-1/cp0/p56x56/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEYrehBEDWDPawY48sH9ilzso2H55p0AlGyjYfnmnQCUVkEbPAx1MrmFc03wDBF08Pn3JJawx3IQ3OjxIjqy2-C&_nc_ohc=d5JXCdeo3tYAX9uE6aK&_nc_ht=scontent.fcgk8-2.fna&oh=00_AT-TJNXQ2XLyxnP0Ie7WB8jfC75S8d7Ssn6KFY4vNvzWEw&oe=6204144E"
                  />
                  <div className="user-info">
                    <h4 className="user-name">{currentUser.username}</h4>
                    <h6 className="company-name">{currentUser.company.name}</h6>
                  </div>
                </Card.Header>
              </Link>
              <Card.Body
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setModalShow(true);
                  setPostId(post.id);
                  setLoading(true);
                }}>
                <Card.Title className="post-title">{post.title}</Card.Title>
                <Card.Text className="post-text">{post.body}</Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </>
    );
  }

  return (
    <div className="container">
      {/* All Post From Users */}
      {renderPostSection()}

      <ModalComments
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setPostId(null);
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    posts: state.postReducer.posts,
    users: state.postReducer.users
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllPost: () => {
      return dispatch(getAllPost());
    },
    getAllUser: () => {
      return dispatch(getAllUser());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
