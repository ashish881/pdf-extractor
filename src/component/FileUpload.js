import React, { useState, useEffect } from "react";
import axios from "axios";
import { DropzoneArea, DropzoneDialog } from "material-ui-dropzone";
import PdfViewer from "./PdfViewer";
import { Checkbox } from "@material-ui/core";
import ReactPaginate from "react-paginate";
import PdfhighLight from "./PdfhighLight";
import { differenceInCalendarYears, differenceInYears, parse } from "date-fns";
import update from "immutability-helper";
import Modal from "react-modal";
import {
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  ListSubheader,
  CardContent,
  Accordion,
  Card,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ExportExcel from "./ExportExcel";
import Loader from "./Loader";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#d4d4d4",
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: '50%',
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    // maxHeight: 600,
    height: 700,
    borderRadius: 10,
  },
  pdfRoot: {
    width: "100% ",
    // maxHeight: 300,
    // height: 330,
    height: 800,
    overflow: "auto",
    overflowX: "hidden",
  },
  listSection: {
    backgroundColor: "inherit",
    borderBottom: "1px solid #d4d4d4",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfScrollBottom, setPdfScrollBottom] = useState(null);
  const [highLightPdf, setHighLightPdf] = useState("");
  const [files, setFiles] = useState(null);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [calculateBtnTrigger, setcalculateBtnTrigger] = useState(false);
  const [pdfExtractData, setPdfExtractData] = React.useState([]);
  // const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [checked, setChecked] = useState([]);

  //
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  console.log("=====================checkedinitial", checked);
  const PER_PAGE = 1;

  console.log("999999999999", currentPage);

  const offset = currentPage * PER_PAGE;

  const checkedData = checked
    ?.slice(offset, offset + PER_PAGE)
    .map((thumburl) => thumburl);
  console.log(checkedData, "----000checkedData");

  const fileName = checkedData[0]?.map((a) => a?.key);
  console.log("filename", fileName);

  // const currentPdfFileData = files
  //   ?.slice(offset, offset + PER_PAGE)
  //   .map((thumburl) => thumburl);

  const infoUser = pdfExtractData
    ?.slice(offset, offset + PER_PAGE)
    .map((thumburl) => thumburl);

  //get pdf file match with info and checked array.
  const currentPdfFileData = files?.filter((a) => a?.name == fileName?.[0]);
  const pageCount = Math.ceil(files?.length / PER_PAGE);

  const handleCheck = (value, index) => {
    //take a index of individual click
    //Create a copy of the state array..do not modified current state

    let newArray = [...checked[currentPage]];

    //Update the one value in object with specific index
    newArray[index] = {
      ...newArray[index],
      isChecked: !newArray[index]?.isChecked,
    };

    console.log(".........", newArray);

    //set that in state.
    // checked.splice(currentPage, 1, newArray);
    const updatedArr = update(checked, {
      $splice: [[currentPage, 1, newArray]],
    });
    setChecked(updatedArr);
    //check if value in that state then remove else add with toggle
    // setChecked(
    //   checked.includes(value)
    //     ? checked.filter((c) => c !== value)
    //     : [...checked, value]
    // );

    //find specific index and update a state with new value
    // const allData = [...checked];
    // allData[index] = { ...allData[index], checked: event.target.checked };
    // setChecked([...allData]);
  };

  console.log("=======================pdfextract", pdfExtractData);
  console.log("=======================files", files);
  console.log("=====================checked", checked);

  const classes = useStyles();

  useEffect(() => {
    if (files?.length == 0) {
      setPdfExtractData([]);
    }
  }, [files]);

  function generate(element) {
    return pdfExtractData.map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  const handleChange = (files) => {
    // setFiles(files[0]);
    // let findDuplicates = (arr) =>
    //   arr.filter((item, index) => arr.indexOf(item) != index);

    // console.log(findDuplicates(files)); // All duplicates
    // console.log([...new Set(findDuplicates(files))]); // Unique duplicates
    setFiles(files);
    setcalculateBtnTrigger(false);
  };
  console.log(files?.name);

  const deleteFile = (files) => {
    console.log("deleted-------", files);

    //remove array data from checked with condition file.pdf.
    const updateCheckedData = checked.map((a) =>
      a?.filter((a) => a?.key !== files?.name)
    );
    console.log("--------updateChcekdData---", updateCheckedData);
    //remove array data from pdfextract with condition file.pdf.
    const updatePdfExtractData = pdfExtractData.filter(
      (a) => a?.info?.key !== files?.name
    );
    console.log("----infodelet", updatePdfExtractData);
    //remove empty array from checked array.
    let cleanArray = updateCheckedData.filter((e) => e.length);
    setChecked(cleanArray);
    setPdfExtractData(updatePdfExtractData);
    setCurrentPage(0);
  };
  // On file upload (click the upload button)

  const onFileUpload = async () => {
    const names = files.map((a) => a?.name);
    const count = (names) =>
      names.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {}); // don't forget to initialize the accumulator

    const duplicates = (dict) => Object.keys(dict).filter((a) => dict[a] > 1);

    console.log(count(names), "uni"); // { Mike: 1, Matt: 1, Nancy: 2, Adam: 1, Jenny: 1, Carl: 1 }
    console.log(duplicates(count(names)), "dup"); // [ 'Nancy' ]

    if (!files) {
      return;
    } else if (duplicates(count(names)).length > 0) {
      setIsOpen(true);
    } else {
      setLoading(true);
      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      for (const ele of files) {
        formData.append("myFile", ele, ele.name);
      }

      console.log("99999", formData);

      // Details of the uploaded file
      // console.log(selectedFile);

      // Request made to the backend api
      // Send formData object
      const { data } = await axios.post(
        "http://localhost:5000/api/fileupload2/",
        formData
      );

      console.log(data);
      //get response and update in a state
      setPdfExtractData(data.reverse());
    }
  };

  useEffect(() => {
    if (pdfExtractData) {
      setLoading(false);
      const value = pdfExtractData?.map((a) => a?.icd);
      //updting a value in new array
      setChecked(value);
    }
  }, [pdfExtractData]);

  // const pdfScroll = React.useRef();
  // console.log('pdfscrol----------', window.pageYOffset)

  const pdfScroll = (node) => {
    if (node) {
      node.addEventListener("scroll", handleScroll);
    }
  };

  // get scroll value
  const handleScroll = (event) => {
    var node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      console.log("BOTTOM REACHED:", bottom);
      setPdfScrollBottom(bottom);
    }
  };

  // const getRiskScore = pdfExtractData?.icd?.map((a) => a.risk_score);

  //get true value in checked state.
  const checkedTrue = checkedData[0]?.filter((a) => a.isChecked === true);
  const getRiskScore = checkedTrue?.map((a) => a?.risk_score);

  console.log("getRiskscore-=========", getRiskScore);

  //check if male true update 0.85 in array to calculate the value with reduce.
  infoUser[0]?.info?.sex.toUpperCase() === "MALE"
    ? getRiskScore?.push(0.85)
    : getRiskScore?.push(0.87);

  // calculate a age with mm/dd/yyyy
  const calculateAge = (dob) => {
    const date = parse(dob, "MM/dd/yyyy", new Date());
    const age = differenceInYears(new Date(), date);
    return age;
  };

  //call age with dob and store in new variable.
  const getAge = calculateAge(infoUser[0]?.info?.dob);

  console.log("-----------------------------age", getAge);

  //if above then 70 update 0.65 in array.
  getAge < 70 ? getRiskScore?.push(0.65) : getRiskScore?.push(0.95);

  const calculateRiskScore = () => {
    setcalculateBtnTrigger(true);
  };

  const userInfo = [];

  const userObj = {};

  userObj.name = infoUser[0]?.info?.name || "John";
  userObj.age = getAge;
  userObj.dob = infoUser[0]?.info?.dob;
  userObj.sex = infoUser[0]?.info?.sex;

  userInfo.push(userObj);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
    setcalculateBtnTrigger(false);
    setExpanded(false);
  }

  const handleChangeAccordion = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  //modal
  let subtitle;
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
    subtitle.style.fontSize = "16";
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: 50,
        paddingBottom: 50,
        // height: '100%',
        flexDirection: "column",
        // backgroundColor: '#f0ebeb'
      }}
    >
      {/* <h3>Pdf File Upload</h3>
      <div>
        <input type="file" onChange={onFileChange} accept="application/pdf" />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      {fileData()} */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
          Duplicate File Not Allowed
        </h2>
        {/* <button onClick={closeModal}>close</button> */}
      </Modal>
      <div
        className="uploadFile"
        style={{ width: "60%", paddingTop: 20, position: "relative" }}
      >
        <DropzoneArea
          onChange={handleChange}
          showFileNames={true}
          onDelete={deleteFile}
          acceptedFiles={[".pdf"]}
          // filesLimit={1}
        />
        {loading && <Loader />}
      </div>
      <div style={{ marginTop: 30, marginBottom: 30 }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            width: 180,
            fontFamily: "Poppins, sans-serif",
            letterSpacing: "2px",
          }}
          onClick={onFileUpload}
        >
          Upload
        </Button>
      </div>

      {pdfExtractData.length > 0 && files?.length > 0 && (
        <>
          <Card
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              borderRadius: 10,
              marginBottom: 30,
            }}
          >
            <CardContent
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h4"
                  style={{
                    textAlign: "center",
                    marginBottom: 10,
                    color: "#000",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Info
                </Typography>
              </Box>
              <div style={{ display: "flex" }}>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    marginRight: 20,
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Name:
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      // marginRight: 8,
                      marginBottom: 10,
                    }}
                  >
                    {infoUser[0]?.info?.name || `John`}
                  </h3>
                </h3>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    marginRight: 20,
                    fontWeight: 700,
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Age:
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      // marginRight: 8,
                      marginBottom: 10,
                    }}
                  >
                    {getAge}
                  </h3>
                </h3>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    marginRight: 20,
                    fontWeight: 700,
                    flexDirection: "column",
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Dob:
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      // marginRight: 8,
                      marginBottom: 10,
                    }}
                  >
                    {infoUser[0]?.info?.dob}
                  </h3>
                </h3>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    marginRight: 20,
                    fontWeight: 700,
                    flexDirection: "column",
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Gender:
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      // marginRight: 8,
                      marginBottom: 10,
                    }}
                  >
                    {infoUser[0]?.info?.sex}
                  </h3>
                </h3>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {files?.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            {checked.length > 0 && (
              //parent div
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  // backgroundColor: 'yellow'
                  // alignItems: "center",
                }}
              >
                {/*  1st col */}
                <Card
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "38%",
                    height: 820,
                    borderRadius: 10,
                    marginRight: 10,
                    // backgroundColor: "#4a7ae8",
                  }}
                >
                  <CardContent style={{ width: "100%" }}>
                    {/*     <Box>
                    <Typography
                      variant="h5"
                      component="h5"
                      style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        color: '#fff',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Pdf Viewer
                    </Typography>
                    </Box>*/}

                    <div className={classes.pdfRoot} ref={pdfScroll}>
                      <PdfViewer
                        pdfFile={currentPdfFileData}
                        pdfScrollBottom={pdfScrollBottom}
                        setPdfScrollBottom={setPdfScrollBottom}
                        highLightPdf={highLightPdf}
                      />
                    </div>
                  </CardContent>
                </Card>
                {/*  2nd col */}
                <div
                  style={{
                    width: "60%",
                    //  backgroundColor: 'green',
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {/*  new card insert here*/}
                  {/* right table */}
                  <Card
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: 700,
                      borderRadius: 10,
                      // backgroundColor: "red",
                    }}
                  >
                    <CardContent
                      style={{ backgroundColor: "#4a7ae8", width: "100%" }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          component="h6"
                          style={{
                            textAlign: "center",
                            marginBottom: 10,
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Recommended ICD / HCC Codes
                        </Typography>
                      </Box>

                      <div className={classes.root}>
                        {checkedData[0]?.map((sectionId, index) => (
                          <Accordion
                            expanded={expanded === index}
                            onChange={handleChangeAccordion(index)}
                            onClick={() => setHighLightPdf(sectionId.string)}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography
                                style={{
                                  color: "#000",
                                  fontSize: 16,
                                  fontFamily: "Poppins, sans-serif",
                                }}
                              >
                                {sectionId.string}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <table>
                                <tr>
                                  <th>ICD Code</th>
                                  <th>ICD Desc</th>
                                  <th>DOS</th>
                                  <th>HCC</th>
                                  <th>HCC Desc</th>
                                  <th>Rx HCC</th>
                                  <th>Risk Score</th>
                                  <th>Valid</th>
                                </tr>
                                <tr>
                                  <td>{sectionId.icd}</td>
                                  <td>{sectionId.description}</td>
                                  <td>--</td>
                                  <td>{sectionId.hcc_code_v24}</td>
                                  <td>--</td>
                                  <td>{sectionId.rx_hcc_code_v05}</td>
                                  <td>{sectionId.risk_score}</td>
                                  <td>
                                    {/* <Checkbox
                                      checked={isChecked[index]}
                                      value={isChecked[index]}
                                      onChange={(item) => {
                                        console.log(
                                          item,
                                          "iiiiiiiiiiiiiiiiiiiiiiiiiiiii"
                                        );
                                        let tempObj = { ...isChecked };
                                        if (!item) delete tempObj[index];
                                        else tempObj[index] = item;
                                        setIsChecked(tempObj);
                                      }}
                                    /> */}
                                    <Checkbox
                                      onChange={() =>
                                        handleCheck(sectionId, index)
                                      }
                                      // checked={checked?.includes(sectionId)}
                                      checked={sectionId.isChecked}
                                      // defaultChecked={true}
                                    />
                                  </td>
                                </tr>
                              </table>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {checked.length > 0 && files?.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",

              alignItems: "center",
              marginTop: 50,
            }}
          >
            <div
              style={{
                // marginTop: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginRight: 20,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: 200,
                  fontFamily: "Poppins, sans-serif",
                  letterSpacing: "2px",
                }}
                onClick={calculateRiskScore}
              >
                Calculate Risk Score
              </Button>
            </div>
            <div>
              <ExportExcel
                userInfo={userInfo}
                userTable={checkedTrue}
                age={getAge}
              />
            </div>
          </div>
          <h3
            style={{
              marginTop: 10,
              marginBottom: 20,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {calculateBtnTrigger ? (
              <>
                <span
                  style={{
                    marginRight: 10,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  The Final Risk Score is:
                </span>{" "}
                {getRiskScore?.reduce((a, b) => a + b, 0).toFixed(3)}
              </>
            ) : (
              ""
            )}
          </h3>
          <div>
            {files.length > 1 && (
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                // containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                // activeClassName={"pagination__link--active"}
                containerClassName={
                  "pagination"
                } /* as this work same as bootstrap class */
                subContainerClassName={
                  "pages pagination"
                } /* as this work same as bootstrap class */
                activeClassName={
                  "active"
                } /* as this work same as bootstrap class */
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default FileUpload;

{
  /* <AccordionDetails> */
}
{
  /* <Typography */
}
{
  /* //   style={{ */
}
{
  /* //     color: '#000',
//     fontSize: 14,
//     fontFamily: 'Poppins, sans-serif',
//   }}
// >
//   <span
//     style={{ marginRight: 10, fontWeight: 'bold' }}
//   >
//     ICD:
//   </span>
//   {sectionId.icd}
// </Typography>
// </AccordionDetails>
// <AccordionDetails>
// <Typography
//   style={{
//     color: '#000',
//     fontSize: 14,
//     fontFamily: 'Poppins, sans-serif',
//   }}
// >
//   <span
//     style={{ marginRight: 10, fontWeight: 'bold' }}
//   >
//     String:
//   </span>
//   {sectionId.string}
// </Typography>
// </AccordionDetails>
// <AccordionDetails>
// <Typography
//   style={{
//     color: '#000',
//     fontSize: 14,
//     fontFamily: 'Poppins, sans-serif',
//   }}
// >
//   <span
//     style={{ marginRight: 10, fontWeight: 'bold' }}
//   >
//     Description:
//   </span>
//   {''}
//   {sectionId.description}
// </Typography>
// </AccordionDetails>
// <AccordionDetails>
// <Typography
//   style={{
//     color: '#000',
//     fontSize: 14,
//     fontFamily: 'Poppins, sans-serif',
//   }}
// >
//   <span
//     style={{ marginRight: 10, fontWeight: 'bold' }}
//   >
//     hcc_v24:
//   </span>{' '}
//   {sectionId.hcc_code_v24}
// </Typography>
// </AccordionDetails>
// <AccordionDetails>
// <Typography
//   style={{
//     color: '#000',
//     fontSize: 14,
//     fontFamily: 'Poppins, sans-serif',
//   }}
// >
//   <span
//     style={{ marginRight: 10, fontWeight: 'bold' }}
//   >
//     {' '}
//     rx_hcc_v05:
//   </span>{' '}
//   {sectionId.rx_hcc_code_v05}
// </Typography>
// </AccordionDetails>
// <AccordionDetails>
// <Typography
//   style={{
//     color: '#000',
//     fontSize: 14,
//     fontFamily: 'Poppins, sans-serif',
//   }}
// >
//   <span
//     style={{ marginRight: 10, fontWeight: 'bold' }}
//   >
//     {' '}
//     Risk score:
//   </span>{' '}
//   {sectionId.risk_score}
// </Typography>
// </AccordionDetails> */
}
