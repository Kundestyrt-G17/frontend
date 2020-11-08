import React, { useState } from "react";
import styles from "./summary.module.css";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  makeStyles,
  createStyles,
  Theme,
  DialogActions,
  DialogContent,
  Tooltip,
} from "@material-ui/core";
import { IVote } from "@/schemas/vote";
import clsx from "clsx";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface SummaryProps {
  isin: string;
  ballot: IVote;
  submitVote: (ballot: IVote) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

const Summary = (props: SummaryProps) => {
  const { isin, ballot, submitVote } = props;
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  let id = 0;
  const createData = (field, value) => {
    id++;
    return { id, field, value };
  };

  let rows = [
    createData("ISIN", isin),
    createData("Company", ballot.company),
    createData("Amount of bonds owned", ballot.bondsOwned),
    createData("You voted", ballot.favor),
  ];
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className={styles.summaryContainer}>
      <table className={styles.summaryTable}>
        <thead className={styles.summaryColumn}>
          <th
            className={clsx(
              styles.summaryTableHeader,
              styles.summaryPaddingCol1
            )}
          >
            Field
          </th>
          <th
            className={clsx(
              styles.summaryTableHeader,
              styles.summaryPaddingCol2
            )}
          >
            Value
          </th>
        </thead>
        {rows.map((row) => (
          <tr className={styles.summaryRow} key={row.id}>
            <td className={styles.summaryPaddingCol1}>{row.field}</td>
            <td className={styles.summaryPaddingCol2}>{row.value}</td>
          </tr>
        ))}

        <tr className={styles.summaryRow}>
          <td className={styles.summaryPaddingCol1}>Upload proof of holding</td>
          <td>
            <Tooltip title="Preview" arrow>
              <Button
                variant="outlined"
                color="primary"
                component="span"
                size="small"
                onClick={() => setOpen(true)}
              >
                Preview
              </Button>
            </Tooltip>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              className={classes.modal}
              onBackdropClick={() => setOpen(false)}
              fullWidth={true}
              maxWidth={"md"}
            >
              <DialogContent>
                <div>
                  <Document
                    file={ballot.proofOfHolding}
                    onLoadSuccess={onDocumentLoadSuccess}
                    style={{ marginLeft: "0", overflow: "auto" }}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </td>
        </tr>
      </table>
      <FormControlLabel
        className={styles.summaryCheckbox}
        control={
          <Checkbox
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            color="primary"
          />
        }
        label="I confirm that the above information is correct"
      />
      <div className={styles.summaryButton}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isChecked}
          onClick={() => submitVote(ballot)}
        >
          Go to signing
        </Button>
      </div>
    </div>
  );
};

export default Summary;
