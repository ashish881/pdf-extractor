import React, { useCallback, useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
import samplePDF from '../SampleMedicalRecord4.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// https://gist.github.com/wojtekmaj/f265f55e89ccb4ce70fbd2f8c7b1d95d
function highlightPattern(text, pattern) {
  const splitText = text.split(pattern);

  if (splitText.length <= 1) {
    return text;
  }

  const matches = text.match(pattern);

  return splitText.reduce(
    (arr, element, index) =>
      matches[index]
        ? [...arr, element, <mark key={index}>{matches[index]}</mark>]
        : [...arr, element],
    []
  );
}

// You might want to merge the items a little smarter than that
function getTextItemWithNeighbors(textItems, itemIndex, span = 1) {
  return textItems
    .slice(Math.max(0, itemIndex - span), itemIndex + 1 + span)
    .filter(Boolean)
    .map((item) => item.str)
    .join('');
}

function getIndexRange(string, substring) {
  const indexStart = string.indexOf(substring);
  const indexEnd = indexStart + substring.length;
  console.log('--------0000000000', indexStart, indexEnd);
  return [indexStart, indexEnd];
}

function Test({ pdfFile, pdfScrollBottom, setPdfScrollBottom, highLightPdf }) {
  const [numPages, setNumPages] = useState(null);
  const [textItems, setTextItems] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  const stringToHighlight = highLightPdf;

  React.useEffect(() => {
    const pdfContainer = document
      .getElementsByClassName('makeStyles-pdfRoot-5')[0]
      .getElementsByTagName('span');

    for (let i = 0; i < pdfContainer.length; i++) {
      pdfContainer[i].classList.remove('highlight');

      if (pdfContainer[i].innerHTML.match(highLightPdf)) {
        pdfContainer[i].classList.add('highlight');
        pdfContainer[i].scrollIntoView();
        window.scrollBy(0, -250);
        console.log('true');
      } else {
        console.log('false');
      }
    }
  }, [highLightPdf]);

  const onPageLoadSuccess = useCallback(async (page) => {
    const textContent = await page.getTextContent();
    setTextItems(textContent.items);
    // console.log("ghngbngbnbvnbv", textContent.items);
  }, []);

  //   const customTextRenderer = useCallback(
  //     (textItem) => {
  //       if (!textItems) {
  //         return;
  //       }

  //       const { itemIndex } = textItem;
  //       //   console.log("============================itemIndex", itemIndex);
  //       const matchInTextItem = textItem.str.match(stringToHighlight);

  //       if (matchInTextItem) {
  //         // Found full match within current item, no need for black magic
  //         return highlightPattern(textItem.str, stringToHighlight);
  //       }

  //       // Full match within current item not found, let's check if we can find it
  //       // spanned across multiple lines

  //       // Get text item with neighbors
  //       const textItemWithNeighbors = getTextItemWithNeighbors(
  //         textItems,
  //         itemIndex
  //       );

  //       const matchInTextItemWithNeighbors =
  //         textItemWithNeighbors.match(stringToHighlight);

  //       if (!matchInTextItemWithNeighbors) {
  //         // No match
  //         return textItem.str;
  //       }

  //       // Now we need to figure out if the match we found was at least partially
  //       // in the line we're currently rendering
  //       const [matchIndexStart, matchIndexEnd] = getIndexRange(
  //         textItemWithNeighbors,
  //         stringToHighlight
  //       );
  //       const [textItemIndexStart, textItemIndexEnd] = getIndexRange(
  //         textItemWithNeighbors,
  //         textItem.str
  //       );

  //       if (
  //         // Match entirely in the previous line
  //         matchIndexEnd < textItemIndexStart ||
  //         // Match entirely in the next line
  //         matchIndexStart > textItemIndexEnd
  //       ) {
  //         return textItem.str;
  //       }

  //       // Match found was partially in the line we're currently rendering. Now
  //       // we need to figure out what does "partially" exactly mean

  //       // Find partial match in a line
  //       const indexOfCurrentTextItemInMergedLines = textItemWithNeighbors.indexOf(
  //         textItem.str
  //       );
  //       const matchIndexStartInTextItem = Math.max(
  //         0,
  //         matchIndexStart - indexOfCurrentTextItemInMergedLines
  //       );
  //       const matchIndexEndInTextItem =
  //         matchIndexEnd - indexOfCurrentTextItemInMergedLines;

  //       const partialStringToHighlight = textItem.str.slice(
  //         matchIndexStartInTextItem,
  //         matchIndexEndInTextItem
  //       );

  //       return highlightPattern(textItem.str, partialStringToHighlight);
  //     },
  //     [stringToHighlight, textItems]
  //   );

  return (
    <SizeMe
      monitorHeight
      refreshRate={128}
      refreshMode={'debounce'}
      render={({ size }) => (
        <div>
          <Document
            file={pdfFile[0]}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <div>
              {Array.apply(null, Array(numPages))
                .map((x, i) => i + 1)
                .map((page) => (
                  <Page
                    width={size.width}
                    pageNumber={page}
                    //   customTextRenderer={customTextRenderer}
                    onLoadSuccess={onPageLoadSuccess}
                  />
                ))}
            </div>
          </Document>
        </div>
      )}
    />
  );
}

export default Test;

// return (
//     <div style={{ width: "100%" }}>
//         <Document file={pdfFile}
//             onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//         >
//             {Array.apply(null, Array(numPages))
//                 .map((x, i) => i + 1)
//                 .map(page => <Page pageNumber={page} />)}
//         </Document>
//     </div>

// );

// <div style={{ width: "100%" }}>
// <Document
//   file={pdfFile}
//   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
// >
//   {Array.apply(null, Array(numPages))
//     .map((x, i) => i + 1)
//     .map((page) => (
//       <Page
//         pageNumber={page}
//         //   customTextRenderer={customTextRenderer}
//         onLoadSuccess={onPageLoadSuccess}
//       />
//     ))}
// </Document>
// </div>
