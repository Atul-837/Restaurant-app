import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Loading } from "./LoadingComponent";
import { Control, LocalForm, Errors } from "react-redux-form";
import {FadeTransform} from "react-animation-components"
import { baseUrl } from "../shared/baseUrl";

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }
  handleSubmit(values) {
    this.toggleModal();
    const comment = this.props.postComment;
     if(comment)
    comment(this.props.dishId, values.rating, values.name, values.feedback);
  }

  render() {
    return (
      <>
        <Button outline onClick={this.toggleModal} color="dark">
          <span className="fa fa-solid fa-comment" />
          CLICK HERE TO COMMENT
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            YOUR FEEDBACK PLEASE..
          </ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label htmlFor="rating" md={2}>
                  Rating
                </Label>
                <Col md={{ size: 3, offset: 2 }}>
                  <Control.select
                    model=".rating"
                    id="rating"
                    name="rating"
                    className="form-control"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="name" md={5}>
                  Your Name
                </Label>
                <Control.text
                  model=".name"
                  id="name"
                  name="name"
                  className="form-control"
                  validators={{
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(15),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".name"
                  show="touched"
                  messages={{
                    required: "Required",
                    minLength: "Must be greater than 2 characters",
                    maxLength: "Must be 15 characters or less",
                  }}
                />
              </Row>
              <Row className="form-group">
                <Label htmlFor="feedback" md={2}>
                  Comment
                </Label>
                <Control.textarea
                  model=".feedback"
                  id="feedback"
                  name="feedback"
                  rows="6"
                  className="form-control"
                  placeholder="Your comments please"
                />
              </Row>
              <Button type="submit" value="submit" color="dark">
                SUBMIT
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
        ;
      </>
    );
  }
}

function RenderDish({ dish }) {
  if (dish) {
    return (
      <div>
        <Card>
          <CardImg src={baseUrl + dish.image} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  } else {
    return <div></div>;
  }
}

function RenderComments({ comments, postComment, dishId }) {
  return (
    <div>
      <h4>COMMENTS:</h4>
      {comments != null ? (
        comments.map((demo) => {
          return (
            <div key={demo.id}>
              <h6>{demo.comment}</h6>
              <h6>
                -- {demo.author},{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }).format(new Date(Date.parse(demo.date)))}
              </h6>
            </div>
          );
        })
      ) : (
        <div></div>
      )}
      <div className="container">
        <CommentForm dishId={dishId} postComment={postComment} />
      </div>
    </div>
  );
}

const DishDetails = (props) => {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments
              comments={props.comments}
              postComment={props.postComment}
              dishId={props.dish.id}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default DishDetails;
