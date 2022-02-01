// import React from "react";
// // import {
// //   PdfLoader,
// //   PdfHighlighter,
// //   Tip,
// //   Highlight,
// //   Popup,
// //   AreaHighlight,
// // } from "react-pdf-highlighter";
// import samplePDF from "../SampleMedicalRecord4.pdf";

// function PdfhighLight({ pdfFile }) {
//   const getNextId = () => String(Math.random()).slice(2);
//   const resetHash = () => {
//     document.location.hash = "";
//   };

//   const parseIdFromHash = () =>
//     document.location.hash.slice("#highlight-".length);

//   const addHighlight = (highlight) => {
//     const highlights = "s";

//     console.log("Saving highlight", highlight);

//     // this.setState({
//     //   highlights: [{ ...highlight, id: getNextId() }, ...highlights],
//     // });
//   };

//   // state = {
//   //   url: initialUrl,
//   //   highlights: testHighlights[initialUrl]
//   //     ? [...testHighlights[initialUrl]]
//   //     : [],
//   // };

//   // const resetHighlights = () => {
//   //   this.setState({
//   //     highlights: [],
//   //   });
//   // };

//   // const toggleDocument = () => {
//   //   const newUrl =
//   //     this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

//   //   this.setState({
//   //     url: newUrl,
//   //     highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
//   //   });
//   // };

//   const scrollViewerTo = (highlight) => { };

//   const getHighlightById = (id) => {
//     const highlights = "s";

//     return highlights.find((highlight) => highlight.id === id);
//   };

//   const scrollToHighlightFromHash = () => {
//     const highlight = getHighlightById(parseIdFromHash());

//     if (highlight) {
//       scrollViewerTo(highlight);
//     }
//   };

//   const updateHighlight = (highlightId, position, content) => {
//     console.log("Updating highlight", highlightId, position, content);

//     this.setState({
//       highlights: this.state.highlights.map((h) => {
//         const {
//           id,
//           position: originalPosition,
//           content: originalContent,
//           ...rest
//         } = h;
//         return id === highlightId
//           ? {
//             id,
//             position: { ...originalPosition, ...position },
//             content: { ...originalContent, ...content },
//             ...rest,
//           }
//           : h;
//       }),
//     });
//   };

//   const HighlightPopup = (text, emoji) =>
//     text ? (
//       <div className="Highlight__popup">
//         {emoji} {text}
//       </div>
//     ) : null;

//   React.useEffect(() => {
//     window.addEventListener("hashchange", scrollToHighlightFromHash, false);
//   }, []);

//   return (
//     <div>
//       <PdfLoader url={samplePDF}>
//         {(pdfDocument) => (
//           <PdfHighlighter
//             pdfDocument={pdfDocument}
//             enableAreaSelection={(event) => event.altKey}
//             onScrollChange={resetHash}
//             // pdfScaleValue="page-width"
//             scrollRef={(scrollTo) => {
//               scrollViewerTo = scrollTo;

//               scrollToHighlightFromHash();
//             }}
//             onSelectionFinished={(
//               position,
//               content,
//               hideTipAndSelection,
//               transformSelection
//             ) => (
//               <Tip
//                 onOpen={transformSelection}
//                 onConfirm={(comment) => {
//                   addHighlight({ content, position, comment });

//                   hideTipAndSelection();
//                 }}
//               />
//             )}
//             highlightTransform={(
//               highlight,
//               index,
//               setTip,
//               hideTip,
//               viewportToScaled,
//               screenshot,
//               isScrolledTo
//             ) => {
//               const isTextHighlight = !Boolean(
//                 highlight.content && highlight.content.image
//               );

//               const component = isTextHighlight ? (
//                 <Highlight
//                   isScrolledTo={isScrolledTo}
//                   // position={highlight.position}
//                   comment={highlight.comment}
//                 />
//               ) : (
//                 <AreaHighlight
//                   isScrolledTo={isScrolledTo}
//                   highlight={highlight}
//                   onChange={(boundingRect) => {
//                     updateHighlight(
//                       highlight.id,
//                       { boundingRect: viewportToScaled(boundingRect) },
//                       { image: screenshot(boundingRect) }
//                     );
//                   }}
//                 />
//               );

//               return (
//                 <Popup
//                   popupContent={<HighlightPopup {...highlight} />}
//                   onMouseOver={(popupContent) =>
//                     setTip(highlight, (highlight) => popupContent)
//                   }
//                   onMouseOut={hideTip}
//                   key={index}
//                   children={component}
//                 />
//               );
//             }}
//             highlights="s"
//           />
//         )}
//       </PdfLoader>
//     </div>
//   );
// }

// export default PdfhighLight;
