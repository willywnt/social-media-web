import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const DetailPost = () => {
  const [user, setUser] = useState({});
  const [post, setPost] = useState({});
  const { postId } = useParams();

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((response) => {
        if (response.status === 200) {
          setPost(response.data);
          return response.data;
        } else {
          console.log(response.data);
        }
      })
      .then((post) => {
        axios
          .get(`https://jsonplaceholder.typicode.com/users?id=${post.userId}`)
          .then((response) => {
            if (response.status === 200) {
              setUser(response.data[0]);
            } else {
              console.log(response.data);
            }
          });
      })
      .catch((error) => console.log(error));
  }, [postId]);
  function renderDetailPost() {
    return (
      <div>
        <h1>Comments</h1>
        <Card className="post-list" border="info" bg="light">
          <Link to={`/user/${user.id}`}>
            <Card.Header as="h5" className="header-post">
              <Image
                className="avatar-user"
                src="https://scontent.fcgk8-2.fna.fbcdn.net/v/t1.30497-1/cp0/p56x56/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEYrehBEDWDPawY48sH9ilzso2H55p0AlGyjYfnmnQCUVkEbPAx1MrmFc03wDBF08Pn3JJawx3IQ3OjxIjqy2-C&_nc_ohc=d5JXCdeo3tYAX9uE6aK&_nc_ht=scontent.fcgk8-2.fna&oh=00_AT-TJNXQ2XLyxnP0Ie7WB8jfC75S8d7Ssn6KFY4vNvzWEw&oe=6204144E"
              />
              <div className="user-info">
                <h4 className="user-name">{user.username}</h4>
              </div>
            </Card.Header>
          </Link>
          <Card.Body>
            <Card.Title className="post-title">{post.title}</Card.Title>
            <Card.Text className="post-text">{post.body}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
  return (
    <div className="container">
      {/* Detail Post */}
      {renderDetailPost()}
    </div>
  );
};

export default DetailPost;
