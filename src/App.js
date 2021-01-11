import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import FileBase64 from "react-file-base64";
import "./App.css";
import fire from "./firebaseCongif";
// import { Response } from "./Response.json";
import { auth } from "./firebaseCongif";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Redirect } from "react-router-dom";

function App(props) {
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));
  const firebase = fire.database();
  const classes = useStyles();
  const [image, setImage] = useState("");
  const [scannedItems, setScannedItems] = useState([]);
  const [scannedTime, setScannedTime] = useState([]);
  var textRegex = /\w{3,}/;
  var timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;

  function processResponse(response) {
    const days = [];
    const time = [];
    const fullTextAnnotation = response.fullTextAnnotation;
    fullTextAnnotation.pages.forEach((page) => {
      page.blocks.forEach((block) => {
        block.paragraphs.forEach((paragraph) => {
          paragraph.words.forEach((word) => {
            const wordText = word.symbols.map((s) => s.text).join("");
            if (textRegex.test(wordText)) {
              days.push(wordText.match(textRegex)[0]);
            } else if (timeRegex.test(wordText)) {
              time.push("0" + wordText.match(timeRegex)[0]);
            }
          });
        });
      });
    });
    setScannedItems(days);
    setScannedTime(time);
  }

  const addTimeField = () => {
    setScannedTime([...scannedTime, ""]);
  };

  const removeTimeField = () => {
    scannedTime.pop();
    setScannedTime([...scannedTime]);
  };

  const addItemField = () => {
    setScannedItems([...scannedItems, ""]);
  };
  const removeItemField = () => {
    scannedItems.pop();
    setScannedItems([...scannedItems]);
  };

  const handleItemChange = (e, index) => {
    scannedItems[index] = e.target.value;
    setScannedItems([...scannedItems]);
  };

  const handleTimeChange = (e, index) => {
    scannedTime[index] = e.target.value;
    setScannedTime([...scannedTime]);
  };

  function encodeString(file) {
    setImage(file.base64.split(",")[1]);
  }

  function createObject() {
    const scannedDiet = Object.assign(
      ...scannedItems.map((key, index) => ({
        [key]: scannedTime[index],
      }))
    );
    console.log(scannedDiet);
    return scannedDiet;
  }

  const encode = () => {
    return <FileBase64 onDone={encodeString} />;
  };

  const key = "AIzaSyAEmD4IsZkFQNs6l9W16Sl6DGZO_yLcuHo";
  const submit = async () => {
    try {
      let body = JSON.stringify({
        requests: [
          {
            features: [
              {
                type: "DOCUMENT_TEXT_DETECTION",
                maxResults: 1,
              },
            ],
            image: {
              content: image,
            },
          },
        ],
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" + key,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body,
        }
      );
      let jsonResponse = await response.json();
      processResponse(jsonResponse.responses[0]);
    } catch (error) {
      console.log(error);
    }
  };

  function logout(e) {
    auth.signOut().then(() => {
      console.log("logged out");
      localStorage.clear();
      props.history.push("/");
    });
  }

  const finalSubmit = () => {
    // const scannedDiet = {
    //   Idli: "09:00",
    //   Dosa: "01:00",
    //   Upma: "20:00",
    //   "Pav Bhaji": "14:00",
    //   Snacks: "16:00",
    // };
    const scannedDiet = createObject();
    firebase.ref(localStorage.getItem("userAuth")).update(scannedDiet);
    alert("We have got your response, Thank you! ");
    // window.location.reload();
  };

  return (
    <div className="App">
      {localStorage.getItem("userAuth") == null ? (
        <Redirect to="/" />
      ) : (
        <div>
          <h1>
            Welcome to OnTrack for Dieticians
            <span className="btn-logout">
              <Button onClick={logout} color="secondary" variant="contained">
                Logout
              </Button>
            </span>
          </h1>

          <Button variant="outlined" size="large">
            {encode()}
          </Button>
          <p>
            <Button
              onClick={submit}
              variant="contained"
              color="secondary"
              size="large"
            >
              Scan Image
            </Button>
          </p>
          <Grid container>
            <Grid item xs={6}>
              <h2> Food Items </h2>
              {scannedItems.map((item, index) => {
                return (
                  <div key={index}>
                    <TextField
                      required
                      type="text"
                      label="Item"
                      onChange={(e) => handleItemChange(e, index)}
                      value={item}
                    ></TextField>
                  </div>
                );
              })}
              <div>
                <Button
                  onClick={addItemField}
                  size="medium"
                  color="primary"
                  className={classes.margin}
                >
                  <AddCircleIcon fontSize="large"></AddCircleIcon>
                </Button>
                <IconButton
                  onClick={removeItemField}
                  color="secondary"
                  aria-label="delete"
                  className={classes.margin}
                >
                  <DeleteIcon fontSize="large" />
                </IconButton>
              </div>
            </Grid>
            <Grid item xs={6}>
              <h2> Timings </h2>
              {scannedTime.map((time, index) => {
                return (
                  <div key={index}>
                    <TextField
                      required
                      value={time}
                      type="time"
                      helper="Time"
                      onChange={(e) => handleTimeChange(e, index)}
                    ></TextField>
                  </div>
                );
              })}
              <div>
                <Button
                  onClick={addTimeField}
                  size="medium"
                  color="primary"
                  className={classes.margin}
                >
                  <AddCircleIcon fontSize="large"></AddCircleIcon>
                </Button>
                <IconButton
                  color="secondary"
                  onClick={removeTimeField}
                  aria-label="delete"
                  className={classes.margin}
                >
                  <DeleteIcon fontSize="large" />
                </IconButton>
              </div>
            </Grid>
          </Grid>
          <p>
            <Button
              onClick={finalSubmit}
              variant="contained"
              color="secondary"
              size="large"
            >
              SUBMIT DIET PLAN
            </Button>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
