import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Image, Row, Col, Nav, Form, Modal, Button, ButtonGroup } from 'react-bootstrap';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import axios from 'axios';

const DetailUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});

  const [phone, setPhone] = useState();
  const [company, setCompany] = useState();
  const [street, setStreet] = useState();
  const [city, setCity] = useState();
  const [suite, setSuite] = useState();
  const [zipcode, setZipcode] = useState();

  const fetchPhotos = (ids) => {
    let apiUrl = `https://jsonplaceholder.typicode.com/photos?albumId=${ids}`;
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          setPhotos(response.data);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setCompany(response.data.company.name);
          setPhone(response.data.phone.split(' ')[0]);
          setStreet(response.data.address.street);
          setCity(response.data.address.city);
          setSuite(response.data.address.suite);
          setZipcode(response.data.address.zipcode);
        } else {
          console.log(response.data);
        }
      })
      .then(() => {
        axios
          .get(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
          .then((response) => {
            setAlbums(response.data);
            return response.data;
          })
          .then((resAlbums) => {
            let ids = resAlbums
              .map((item) => {
                return item.id;
              })
              .join('&albumId=');
            fetchPhotos(ids);
          });
      })
      .catch((error) => console.log(error));
  }, [userId]);

  const Profile = () => {
    return (
      <div className="profile">
        <div className="profile-avatar-name">
          <Image
            className="avatar-userx2"
            src="https://scontent.fcgk8-2.fna.fbcdn.net/v/t1.30497-1/cp0/p56x56/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEYrehBEDWDPawY48sH9ilzso2H55p0AlGyjYfnmnQCUVkEbPAx1MrmFc03wDBF08Pn3JJawx3IQ3OjxIjqy2-C&_nc_ohc=d5JXCdeo3tYAX9uE6aK&_nc_ht=scontent.fcgk8-2.fna&oh=00_AT-TJNXQ2XLyxnP0Ie7WB8jfC75S8d7Ssn6KFY4vNvzWEw&oe=6204144E"
          />
          <div>
            <h4 className="profile-name">{user.name}</h4>
            <h6 className="profile-username">{user.username}</h6>
          </div>
        </div>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control placeholder="Email" defaultValue={user.email} disabled readOnly />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Phone</Form.Label>
              <Form.Control placeholder="Phone" value={phone} disabled readOnly />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Website</Form.Label>
              <Form.Control placeholder="Website" value={user.website} disabled readOnly />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Company Name</Form.Label>
              <Form.Control placeholder="Company" value={company} disabled readOnly />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="Address" value={street} disabled readOnly />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>City</Form.Label>
              <Form.Control placeholder="City" value={city} disabled readOnly />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Suite</Form.Label>
              <Form.Control placeholder="Suite" value={suite} disabled readOnly />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Zip</Form.Label>
              <Form.Control placeholder="Zip" value={zipcode} disabled readOnly />
            </Form.Group>
          </Row>
        </Form>
      </div>
    );
  };

  const Albums = () => {
    return (
      <div className="albums">
        {albums.map((album) => {
          let filteredPhotos = photos.filter((a) => a.albumId === album.id);
          return (
            <div key={album.id}>
              <h5 className="album-title">{album.title}</h5>
              <div className="album-photo">
                {filteredPhotos.map((photo) => {
                  return (
                    <div
                      onClick={() => {
                        setModalShow(true);
                        setSelectedImage(photo);
                      }}
                      className="photo"
                      key={photo.id}>
                      <Image src={photo.thumbnailUrl} className="photo-thumbnail" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  function renderProfileAndAlbums() {
    return (
      <Tab.Container className="tabs-container" defaultActiveKey="first" transition>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Albums</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Profile />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Albums />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }

  const ModalZoomPhoto = (props) => {
    return (
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{selectedImage.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-photo">
          <TransformWrapper initialScale={1}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent>
                  <Image className="photo-full" src={selectedImage.url} />
                </TransformComponent>
                <ButtonGroup className="btn-zoom">
                  <Button variant="outline-info" onClick={() => zoomIn()}>
                    +
                  </Button>
                  <Button variant="outline-warning" onClick={() => zoomOut()}>
                    -
                  </Button>
                  <Button variant="outline-danger" onClick={() => resetTransform()}>
                    x
                  </Button>
                </ButtonGroup>
              </>
            )}
          </TransformWrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return (
    <div className="container2">
      {/* Show Profile & Albums */}
      {renderProfileAndAlbums()}

      <ModalZoomPhoto
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setSelectedImage({});
        }}
      />
    </div>
  );
};

export default DetailUser;
