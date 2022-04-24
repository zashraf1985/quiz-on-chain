import { CancelRounded, CheckCircle } from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { QuestionInfo } from "../../../types";

export function Question({
  questionInfo,
  answerHandler,
  currentQuestionIndex,
  disableOptions,
  iconToShow,
}: QuestionProps) {
return (
  <FormControl>
    <FormLabel>
      <p><b>Question {currentQuestionIndex + 1}:</b></p>
      <p style={{ "paddingLeft": "10px"}}>{questionInfo.question} ?</p></FormLabel>
    <RadioGroup
      onChange={answerHandler}
      style={{
        "paddingLeft": "10px"
      }}
    >
      {
        questionInfo.options.map((option, optionIndex) => {
          return (
            <FormControlLabel
              name={optionIndex.toString()}
              key={`${currentQuestionIndex}-${optionIndex}`}
              value={option.value}
              control={<Radio />}
              disabled={disableOptions}
              label={(
                <label
                  style={{
                    verticalAlign: "middle",
                    display: "inline-block",
                  }}>
                  {option.label}
                  { iconToShow === `correct-${optionIndex}` &&
                    <CheckCircle
                      style={{
                        marginLeft: 5,
                        verticalAlign: "middle",
                        display: "inline-block",
                      }}
                      color="success"
                    />
                  }
                  { iconToShow === `incorrect-${optionIndex}` &&
                    <CancelRounded
                      style={{
                        marginLeft: 5,
                        verticalAlign: "middle",
                        display: "inline-block",
                      }}
                      color="error"
                    />
                  } 
                </label>
              )}
            />
          )
        })
      }
    </RadioGroup>
  </FormControl>
);
}

interface QuestionProps {
  questionInfo: QuestionInfo
  currentQuestionIndex: number
  answerHandler: (event: React.ChangeEvent<HTMLInputElement>, value: string) => {}
  disableOptions: boolean
  iconToShow: string
}
