import React, { useState } from "react";
import styles from "./redirect.module.css";
import BallotForm from "../components/BallotForm/BallotForm";
import { Vote } from "../utils/interfaces";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

function getSteps() {
  return ["Fill out ballot", "Upload Proof of Holding", "Summary", "Sign"];
}

const BallotPage = () => {
  const [filledOutVote, setFilledOutVote] = useState<Vote>();
  const [activeStep, setActiveStep] = React.useState(0);
  const router = useRouter();

  const handleBack = (step: number) => {
    step === 0
      ? router.back()
      : setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const classes = useStyles();
  const steps = getSteps();

  function getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return (
          <div className={styles.ballotPage}>
            <h1>{getSteps()[0]} </h1>
            <BallotForm
              ISIN={"203578"}
              setFilledOutVote={setFilledOutVote}
              setActiveStep={setActiveStep}
              filledOutVote={filledOutVote}
            />
          </div>
        );
      case 1:
        return (
          <>
            <h1>{getSteps()[1]}</h1>
            <p>
              <span>{filledOutVote?.custodianName}</span>
            </p>
            <Button
              onClick={() =>
                router.push({
                  pathname: "/submitted",
                  query: { from: "vote" },
                })
              }
            >
              Trykk for å komme til submitted
            </Button>
          </>
        );
      case 2:
        return "Summary";
      default:
        return "Unknown stepIndex";
    }
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => handleBack(activeStep)}
              className={classes.backButton}
            >
              <ArrowBackIosIcon />
              Back
            </Button>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default BallotPage;
