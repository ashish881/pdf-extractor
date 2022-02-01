import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import FileUpload from "./component/FileUpload";
import PdfViewer from "./component/PdfViewer";
// import Pagination from "./component/Pagination";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            className={classes.title}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "500",
              letterSpacing: "2px",
            }}
          >
            HCC Coding NLP Tool
          </Typography>
        </Toolbar>
      </AppBar>
      <FileUpload />
    </div>
  );
}

export default App;
