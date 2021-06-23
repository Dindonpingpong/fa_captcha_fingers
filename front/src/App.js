import React, { useState } from 'react';
import './App.css';
import Webcam from "react-webcam";
import { Row, Col, Alert, Button, Form, FormGroup, Label, Input, } from 'reactstrap';
import Info from './Info';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const getRandomFingers = () => {
  return Math.floor(Math.random() * 4 + 1);
}

const LoginForm = ({ setLogged }) => {

  return (
    <Row>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" />
        </FormGroup>
        <Button color="primary" onClick={() => setLogged(true)}>Авторизоваться</Button>
      </Form>
    </Row>
  )
}

const WebcamCapture = () => {
  const [src, setSrc] = useState();
  const [fingers, setFingers] = useState(getRandomFingers());
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState();
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    () => setSrc(webcamRef.current.getScreenshot()),
    [webcamRef]
  );

  const retake = () => setSrc();

  const b64toBlob = (dataURI) => {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  const send = () => {

    const blob = b64toBlob(src);

    let formData = new FormData();
    formData.append('file', blob);

    const options = {
      method: "POST",
      header: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    }

    fetch("/fingers/", options)
      .then((data) => data.json())
      .then((json) => {
        if (json.fingers === fingers)
          setSuccess(true);
        else {
          setMsg("Тест не пройден(");
          retake();
          setFingers(getRandomFingers());
        }
      })
  };

  if (success) {
    return (
      <>
        <Row>
          <Alert color="success">Captcha пройдена!)</Alert>
        </Row>
      </>
    )
  }

  return (
    <>
      <Row>
        {
          msg &&
          <Col>
            <Info message={msg} setMsg={setMsg}/>
          </Col>
        }
        {
          !msg &&
          <Col>
            <Alert>Покажите {fingers}</Alert>
          </Col>
        }
      </Row>
      <Row>
        {
          !src &&
          <Webcam
            audio={false}
            height={360}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            videoConstraints={videoConstraints}
          />
        }
        {
          src &&
          <Col>
            <img src={src} alt="test" width={640} />
          </Col>
        }
      </Row>
      <Row>
        {
          !src &&
          <Col>
            <Button color="primary" onClick={capture}>
              Сфотографировать
            </Button>
          </Col>
        }
        {
          src &&
          <Col>
            <Button color="primary" onClick={retake}>
              Переснять
            </Button>
          </Col>
        }
        {
          src &&
          <Col>
            <Button color="success" onClick={send}>
              Отправить
            </Button>
          </Col>
        }
      </Row>
    </>
  );
};

const App = () => {
  const [isLogged, setLogged] = useState();

  return (
    <div className="App">
      <header className="App-header">
        {
          !isLogged &&
          <LoginForm setLogged={setLogged} />
        }
        {
          isLogged &&
          <WebcamCapture />
        }
      </header>
    </div>
  );
}

export default App;
